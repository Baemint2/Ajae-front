import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
    return (
        <div>
            <Navbar />
            <main>
            <Sidebar />
            </main>
        </div>
    )
}

export default Layout;