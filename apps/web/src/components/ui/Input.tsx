import React from "react";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
    placeholder,
    type,
    ...props
}) => {
    const displayPlaceholder = type === "password" ? "••••••••" : placeholder;

    return (
        <input
            type={type}
            className="border border-slate-400 rounded-md focus:outline-none px-3 py-1 w-96"
            placeholder={displayPlaceholder}
            {...props}
        />
    );
};

export default Input;
