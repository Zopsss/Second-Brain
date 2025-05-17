import { Link, useNavigate } from "react-router";
import { Lock, Username } from "../components/icons";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { ENV_VARS } from "../constants/envs";

const Login = ({ setIsAuth }: { setIsAuth: (arg0: boolean) => void }) => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<{ username: string; password: string }>();

    const onSubmit: SubmitHandler<{
        username: string;
        password: string;
    }> = async (data) => {
        try {
            const response = await axios.post(
                `${ENV_VARS.BACKEND_URL}/auth/signin`,
                data
            );

            localStorage.setItem("token", response.data.token);
            setIsAuth(true);
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { data, status } = error.response;
                    switch (status) {
                        case 403:
                            setError("root", { message: data.msg });
                            return;
                        default:
                            setError("root", {
                                message: data.msg,
                            });
                            return;
                    }
                }
            }
            setError("root", {
                message: "Something went wrong, please try again.",
            });
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-slate-100 px-3 md:px-0">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-center">
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
                onSubmit={handleSubmit(onSubmit)}
                className="mt-10 flex gap-6 flex-col bg-white w-fit items-center justify-center px-10 py-7 rounded-md"
            >
                <div className="sm:w-96">
                    <label className="text-sm font-semibold">Username</label>
                    <Input
                        placeholder="username"
                        leftIcon={<Username />}
                        className="font-light"
                        {...register("username")}
                    />
                </div>
                <div className="sm:w-96">
                    <label className="text-sm font-semibold">Password</label>
                    <Input
                        type="password"
                        leftIcon={<Lock />}
                        placeholder="••••••••"
                        {...register("password")}
                    />
                </div>
                {errors.root && (
                    <span className="text-red-500 text-sm">
                        {errors.root.message}
                    </span>
                )}
                <Button
                    title="Login"
                    variant="Primary"
                    className="w-full"
                    type="submit"
                />
            </form>
        </div>
    );
};

export default Login;
