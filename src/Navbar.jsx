import logo from "./humor_spoon.jpeg";
import menuIcon from "./menu.png";

const Navbar = () => {
    return (
        <nav>
             <div className="navbar">
                <div className="nav-header">
                    <img className="logo" src={logo} alt="로고" />

                    <div className="menu-wrap">
                         <img src={menuIcon} alt="메뉴 아이콘" />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;