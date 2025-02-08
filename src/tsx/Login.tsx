import naverLogin from "../img/btnG_official.png";
import kakaoLogin from "../img/kakao_login_medium_narrow.png";
import googleLogin from "../img/web_light_sq_SI@2x.png";
import {useState} from "react";

const Login = () => {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleLogin = (provider: string) => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    }

    const handleLogin2 = async () => {
        const data = new URLSearchParams({
            username: username,
            password: password,
        });

        const response = await fetch("http://localhost:8090/login", {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: "post",
            body: data,
            credentials: 'same-origin'
        });
        console.log(response);
        window.location.href = response.url
        // const test = await response.json();
        // console.log(test)
    };

    return (

        <div className="login-container">
            <h1 className="text-3xl font-bold text-center mb-5">간편 로그인 하기</h1>
            <img id="kakao-login" 
                 src={kakaoLogin} 
                 alt="카카오 로그인"
                 onClick={() => handleLogin("kakao")}>
                 </img>
            <img id="naver-login" src={naverLogin} alt="네이버 로그인" onClick={() => handleLogin("naver")}></img>
            <img id="google-login" src={googleLogin} alt="구글 로그인" onClick={() => handleLogin("google")}></img>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>아이디</label>
                <input
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // ✅ 입력값 변경 시 상태 업데이트
                />
                <label>비밀번호</label>
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // ✅ 입력값 변경 시 상태 업데이트
                />
                <button onClick={handleLogin2}>로그인</button>
            </form>
        </div>
    )
}

export default Login;