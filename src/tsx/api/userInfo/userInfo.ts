export const getUserInfo = async () => {
    const getCookie = (name: String) => {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return value;
        }
        return null;
    };
    try {
        const response = await fetch(`http://localhost:8090/userInfo/${getCookie("username")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json(); // 데이터를 반환
    } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
    }
};