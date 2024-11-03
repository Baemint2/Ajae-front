import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import {Outlet, useLocation} from "react-router-dom";


const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const sidebarRef = useRef(null); // 사이드바 요소 참조
    const location = useLocation();

    const openSidebar = () => setSidebarOpen(true);
    const closeSidebar = () => setSidebarOpen(false);

    useEffect(() => {
    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            closeSidebar();
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

        closeSidebar();
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [location])

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
            setUserInfo(data); // 사용자 정보 설정
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    return (
        <div>
            <Navbar onMenuClick={openSidebar}/>
            <main>
                <Sidebar ref={sidebarRef}
                         isOpen={isSidebarOpen}
                         onClose={closeSidebar}
                         loggedin={isLoggedIn}
                         userInfo={userInfo}/>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;