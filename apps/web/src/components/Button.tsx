import { ReactElement } from "react";

interface ButtonType {
    title: string;
    type: "Primary" | "Secondary";
    leftIcon?: ReactElement;
}

const buttonTypes: Record<ButtonType["type"], string> = {
    Primary:
        "bg-purple-600 text-white border hover:bg-white hover:text-purple-600 transition-all hover:border hover:border-purple-400 duration-300",
    Secondary:
        "bg-purple-100/65 text-purple-800 border border-transparent hover:bg-transparent hover:border-purple-400 transition-all duration-300",
};

const Button = ({ title, type, leftIcon }: ButtonType) => {
    return (
        <button
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm ${buttonTypes[type]}`}
        >
            {leftIcon && <div>{leftIcon}</div>}
            {title}
        </button>
    );
};

export default Button;
