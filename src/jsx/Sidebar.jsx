import React, {useEffect, useState} from "react";
import {Link, useNavigate } from "react-router-dom";
import {useUser} from "./UserContext"

const Sidebar = React.forwardRef(({isOpen, onclose}, ref) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {setUser} = useUser();

    useEffect(() => {
        checkLoginStatus();

    }, []);


    useEffect(() => {
        if (isLoggedIn) {
            getUserInfo();
        }
    }, [isLoggedIn]);

    const checkLoginStatus = async () => {
        const response = await fetch("/api/v1/loginCheck");
        const data = await response.json();
        if (data) {
            setIsLoggedIn(true);
        }
    };

    const getUserInfo = async () => {
        try {
            const response = await fetch("/api/v1/userInfo", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("사용자 정보를 가져오지 못했습니다.");
            const data = await response.json();
            setUser(data);
            setUserInfo(data); // 사용자 정보 설정
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    const logout = async () => {
        console.log("로그아웃 호출");
        const response = await fetch("/api/v1/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.text();
        if (data === "로그아웃 성공") {
            setIsLoggedIn(false);
            navigate("/index");
        }
    }

    return (
        <aside ref={ref}>
             <div className="sidebar">
                        <div className={`fixed top-0 right-0 h-full ${isOpen ? 'w-64' : 'w-0'} bg-gray-800 overflow-hidden transition-all duration-300`} id="sidebar">
                    <button className="absolute top-4 left-4 text-white text-2xl"
                     id="close-button"
                     onClick={onclose}>&times;
                     </button>
                     <div className="user-wrap">
                        {isLoggedIn ? (
                            <div>
                                {userInfo && userInfo.profile ? (
                                    <img src={userInfo.profile} alt="유저 프로필" className="user-img"></img>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        ) : (
                            <div>
                            </div>
                        )}
                     </div>
                    <div className="user-wrap"></div>
                    <ul className="mt-16 space-y-4 text-white">
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <span id="logout"
                                          className="block px-4 py-2 hover:bg-gray-700"
                                          onClick={() => logout()}>로그아웃</span>
                                </li>
                                <li>
                                    <Link to="/AddJoke" className="block px-4 py-2 hover:bg-gray-700">개그 추가하러가기</Link>
                                </li>
                                <li>
                                    <Link to="/myPage" className="block px-4 py-2 hover:bg-gray-700">마이 페이지</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/Login" id="login" className="block px-4 py-2 hover:bg-gray-700">로그인</Link>
                                </li>
                            </>
                        )}

                    </ul>
                </div>
            </div>
        </aside>
    )
});

export default Sidebar;