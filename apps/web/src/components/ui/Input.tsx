import React, { forwardRef, ReactElement } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon: ReactElement;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ leftIcon, className, ...props }, ref) => {
        return (
            <div className="flex flex-1 items-center justify-start relative group">
                <div className="absolute left-2 text-slate-400 group-has-[:focus]:text-purple-500">
                    {leftIcon}
                </div>
                <input
                    ref={ref}
                    className={`border border-slate-300 rounded-md focus:outline-none pl-8 pr-4 pt-1 pb-[0.40rem] w-full focus:border-purple-400 ${className}`}
                    {...props}
                />
            </div>
        );
    }
);

export default Input;
