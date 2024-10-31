const Sidebar = () => {
    return (
        <aside>
             <div className="joke">
                <div className="fixed top-0 right-0 h-full w-0 bg-gray-800 overflow-hidden transition-all duration-300" id="sidebar">
                    <button className="absolute top-4 left-4 text-white text-2xl" id="close-button">&times;</button>
                    <div className="user-wrap"></div>
                    <ul className="mt-16 space-y-4 text-white">
                        <li><a href="/login" id="login" className="block px-4 py-2 hover:bg-gray-700">로그인</a></li>
                        <li><a href="/logout" id="logout" className="block px-4 py-2 hover:bg-gray-700">로그아웃</a></li>
                        <li><a href="/addJoke" className="block px-4 py-2 hover:bg-gray-700">개그 추가하러가기</a></li>
                        <li><a href="/myBookmark" className="block px-4 py-2 hover:bg-gray-700">내 북마크</a></li>
                    </ul>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar;