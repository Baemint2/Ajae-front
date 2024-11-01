import logo from "../img/humor_spoon.jpeg";
import menuIcon from "../img/menu.png";

const Navbar = ( {onMenuClick} ) => {
    return (
        <nav>
             <div className="navbar">
                <div className="nav-header">
                    <img className="logo" src={logo} alt="로고" />

                    <div className="menu-wrap" onClick={onMenuClick}>
                         <img src={menuIcon} alt="메뉴 아이콘"></img>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;