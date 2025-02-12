import { Link } from "react-router";
import Button from "./ui/Button";

const Navbar = ({
    isAuth,
    setIsAuth,
}: {
    isAuth: boolean;
    setIsAuth: (arg0: boolean) => void;
}) => {
    return (
        <nav className="bg-white flex justify-between items-center border-b px-10 lg:px-52 py-3 sticky top-0 z-10">
            <div>
                <h1 className="text-lg font-bold font-mono text-wrap">
                    Second Brain
                </h1>
            </div>
            {isAuth ? (
                <div className="flex gap-2">
                    <Button
                        variant="Secondary"
                        title="Logout"
                        onClick={() => {
                            localStorage.removeItem("token");
                            setIsAuth(false);
                        }}
                    />
                </div>
            ) : (
                <div className="flex gap-2">
                    <Link to="/login">
                        <Button variant="Secondary" title="Login" />
                    </Link>
                    <Link to="/signup">
                        <Button variant="Primary" title="Sign Up" />
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
