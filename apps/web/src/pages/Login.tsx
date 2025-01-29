import { Link, useNavigate } from "react-router";
import { Lock, Mail } from "../components/icons";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate("/dashboard");
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-slate-100">
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Login to your account
                </h1>
                <p className="font-light text-center tracking-wide">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-purple-500 font-semibold"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
            <form
                onSubmit={handleSubmit}
                className="mt-10 flex gap-6 flex-col bg-white min-w-3/12 items-center justify-center px-10 py-7 rounded-md"
            >
                <div className="w-full">
                    <label className="text-sm font-semibold">
                        Email Address
                    </label>
                    <Input
                        placeholder="example@gmail.com"
                        type="email"
                        leftIcon={<Mail />}
                        className="font-light"
                        required
                    />
                </div>
                <div className="w-full">
                    <label className="text-sm font-semibold">Password</label>
                    <Input
                        type="password"
                        leftIcon={<Lock />}
                        placeholder="••••••••"
                        required
                    />
                </div>
                <Button
                    title="Login"
                    variant="Primary"
                    className="w-96"
                    type="submit"
                />
            </form>
        </div>
    );
};

export default Login;
