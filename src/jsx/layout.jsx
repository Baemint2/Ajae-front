import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import {Outlet, useLocation} from "react-router-dom";


const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
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

    return (
        <div>
            <Navbar onMenuClick={openSidebar}/>
            <main>
                <Sidebar ref={sidebarRef}
                         isOpen={isSidebarOpen}
                         onClose={closeSidebar}/>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;