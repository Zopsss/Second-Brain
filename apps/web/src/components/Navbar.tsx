import Button from "./ui/Button";

const Navbar = () => {
    return (
        <nav className="bg-white flex justify-around items-center border-b border-slate-200 p-3 sticky top-0">
            <div>
                <h1 className="text-lg font-bold font-mono">Second Brain</h1>
            </div>
            <div className="flex gap-2">
                <Button variant="Secondary" title="Login" />
                <Button variant="Primary" title="Sign Up" />
            </div>
        </nav>
    );
};

export default Navbar;
