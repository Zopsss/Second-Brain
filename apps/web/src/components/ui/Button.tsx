import { ReactElement } from "react";

interface ButtonType extends React.InputHTMLAttributes<HTMLButtonElement> {
    title: string;
    variant: "Primary" | "Secondary" | "Outline";
    leftIcon?: ReactElement;
    className?: string;
    type?: "button" | "reset" | "submit";
}

const buttonTypes: Record<ButtonType["variant"], string> = {
    Primary:
        "bg-purple-600 text-white border hover:bg-white hover:text-purple-600 transition-all hover:border hover:border-purple-400 duration-300",
    Secondary:
        "bg-purple-100/65 text-purple-800 border border-transparent hover:bg-transparent hover:border-purple-400 transition-all duration-300",
    Outline:
        "border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300",
};

const Button = ({
    title,
    variant,
    leftIcon,
    className,
    type,
    onClick,
}: ButtonType) => {
    return (
        <button
            className={`flex items-center justify-center gap-2 p-2 md:px-4 md:py-2
            rounded-md text-sm text-nowrap font-semibold ${buttonTypes[variant]} ${className}`}
            type={type}
            onClick={onClick}
        >
            {leftIcon && <div>{leftIcon}</div>}
            {title}
        </button>
    );
};

export default Button;
