import React, { ReactElement } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon: ReactElement;
}

const Input: React.FC<InputProps> = ({ className, leftIcon, ...props }) => {
    return (
        <div className="flex flex-1 items-center justify-center relative group">
            <input
                className={`border border-slate-300 rounded-md focus:outline-none pt-1 pb-[0.40rem] w-96 focus:border-purple-300 px-8 ${className}`}
                {...props}
            />
            <div className="absolute left-2 text-slate-400 group-has-[:focus]:text-purple-500">
                {leftIcon}
            </div>
        </div>
    );
};

export default Input;
