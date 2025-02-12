import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { Lock, Username } from "../components/icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ENV_VARS } from "../constants/envs";
import { SignUpSchema, SignUpSchemaType } from "../constants/SignUpSchema";

const SignUp = ({ setIsAuth }: { setIsAuth: (arg0: boolean) => void }) => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<SignUpSchemaType>({
        resolver: zodResolver(SignUpSchema),
    });

    const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
        console.log("object");
        try {
            const response = await axios.post(
                `${ENV_VARS.BACKEND_URL}/auth/signup`,
                data
            );

            localStorage.setItem("token", response.data.token);
            setIsAuth(true);
            navigate("/dashboard");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 403:
                            setError("username", { message: data.msg });
                            return;
                        case 500:
                            setError("root", { message: data.msg });
                            return;
                        default:
                            setError("root", {
                                message:
                                    "Something went wrong, please try again.",
                            });
                            return;
                    }
                }
                setError("root", {
                    message: "Something went wrong, please try again.",
                });
                return;
            }

            setError("root", {
                message: "Something went wrong, please try again.",
            });
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-slate-100">
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Create a new account
                </h1>
                <p className="font-light text-center tracking-wide">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-500 font-semibold">
                        Login
                    </Link>
                </p>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-10 flex gap-4 flex-col bg-white min-w-3/12 items-center justify-center px-10 py-7 rounded-md"
            >
                <div className="w-full">
                    <label className="text-sm font-semibold">Username</label>
                    <Input
                        placeholder="username"
                        leftIcon={<Username />}
                        className="font-light"
                        {...register("username")}
                    />
                    {errors.username && (
                        <span className="text-red-500 text-sm">
                            {errors.username.message}
                        </span>
                    )}
                </div>
                <div className="w-full">
                    <label className="text-sm font-semibold">Password</label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        leftIcon={<Lock />}
                        {...register("password")}
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm">
                            {errors.password.message}
                        </span>
                    )}
                </div>
                <div className="w-full">
                    <label className="text-sm font-semibold">
                        Confirm Password
                    </label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        leftIcon={<Lock />}
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500 text-sm">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>
                <Button
                    title="Sign Up"
                    variant="Primary"
                    className="w-96"
                    type="submit"
                />
                {errors.root && (
                    <span className="text-red-500 text-sm">
                        {errors.root.message}
                    </span>
                )}
            </form>
        </div>
    );
};

export default SignUp;
