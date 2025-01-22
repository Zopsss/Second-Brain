import { Lock, Mail } from "../components/icons";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Login = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-slate-100">
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Login to your account
                </h1>
                <p className="font-light text-center tracking-wide">
                    Don't have an account?{" "}
                    <span className="text-purple-500 font-semibold">
                        Sign Up
                    </span>
                </p>
            </div>
            <form
                onSubmit={handleSubmit}
                className="mt-10 flex gap-6 flex-col bg-white min-w-3/12 items-center justify-center px-10 py-7 rounded-md"
            >
                <div>
                    <p className="text-sm font-semibold mb-2">Email Address</p>
                    <Input
                        placeholder="example@gmail.com"
                        type="email"
                        leftIcon={<Mail />}
                        required
                    />
                </div>
                <div>
                    <p className="text-sm font-semibold mb-2">Password</p>
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
