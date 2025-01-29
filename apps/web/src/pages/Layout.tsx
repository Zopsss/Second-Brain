import { useLocation } from "react-router";
import Navbar from "../components/Navbar";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const hideNavbar =
        location.pathname === "/signup" || location.pathname === "/login";

    return (
        <>
            {!hideNavbar && <Navbar />} {children}
        </>
    );
};

export default Layout;
