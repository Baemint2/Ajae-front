import React from "react";
const Sidebar = React.forwardRef(({isOpen, onclose, loggedin, userInfo}, ref) => {
    return (
        <aside ref={ref}>
             <div className="joke">
                            <div className={`fixed top-0 right-0 h-full ${isOpen ? 'w-64' : 'w-0'} bg-gray-800 overflow-hidden transition-all duration-300`} id="sidebar">
                    <button className="absolute top-4 left-4 text-white text-2xl"
                     id="close-button"
                     onClick={onclose}>&times;
                     </button>
                     <div className="user-wrap">
                        {loggedin ? (
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
                        {loggedin ? (
                            <li><a href="/logout" id="logout" className="block px-4 py-2 hover:bg-gray-700">로그아웃</a></li>
                        ) : (
                            <li><a href="/src/jsx/Login" id="login" className="block px-4 py-2 hover:bg-gray-700">로그인</a></li>
                        )}
                        <li><a href="/src/jsx/AddJoke" className="block px-4 py-2 hover:bg-gray-700">개그 추가하러가기</a></li>
                        <li><a href="/myBookmark" className="block px-4 py-2 hover:bg-gray-700">내 북마크</a></li>
                    </ul>
                </div>
            </div>
        </aside>
    )
});

export default Sidebar;