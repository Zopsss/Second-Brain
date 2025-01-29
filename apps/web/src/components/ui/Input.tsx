import React, { forwardRef, ReactElement, useRef } from "react";
import { Close } from "../icons";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon: ReactElement;
    variant?: "tags";
    tags?: string[];
    setTags?: React.Dispatch<React.SetStateAction<string[]>>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, leftIcon, variant, tags, setTags, ...props }) => {
        if (!variant) {
            return (
                <div className="flex flex-1 items-center justify-start relative group">
                    <div className="absolute left-2 text-slate-400 group-has-[:focus]:text-purple-500">
                        {leftIcon}
                    </div>
                    <input
                        className={`border border-slate-300 rounded-md focus:outline-none pl-8 pr-4 pt-1 pb-[0.40rem] w-full focus:border-purple-400 ${className}`}
                        {...props}
                    />
                </div>
            );
        }

        const inputRef = useRef<HTMLInputElement>(null);

        return (
            <div
                onClick={() => inputRef.current?.focus()}
                className="cursor-text flex flex-1 p-1.5 gap-2 items-center justify-start relative group rounded-md border focus-within:border-purple-400"
            >
                <div className="text-slate-400 group-has-[:focus]:text-purple-500">
                    {leftIcon}
                </div>
                <div className="flex items-center justify-start w-full flex-wrap gap-2">
                    {tags && tags.length >= 1 && (
                        <div className="flex gap-1 flex-wrap">
                            {tags?.map((tag) => {
                                return (
                                    <div className="cursor-pointer flex gap-2 items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                                        <span className="text-xs text-nowrap">
                                            {tag}
                                        </span>
                                        <span
                                            onClick={() =>
                                                setTags?.(
                                                    tags.filter(
                                                        (t) => t !== tag
                                                    )
                                                )
                                            }
                                        >
                                            <Close width={13} height={13} />
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        className={`focus:outline-none shrink pr-3 flex-1 ${className}`}
                        onKeyDown={(e) => {
                            const inputElement = e.target as HTMLInputElement;

                            if (e.key === ",") {
                                e.preventDefault();
                                const value = (e.target as HTMLInputElement)
                                    .value;
                                if (value.trim() === "") return;
                                setTags?.((tags) => [...tags, value]);
                                inputElement.value = "";
                            }

                            if (
                                e.key === "Backspace" &&
                                inputElement.value === ""
                            ) {
                                setTags?.((tags) =>
                                    tags.slice(0, tags.length - 1)
                                );
                            }
                        }}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);

export default Input;
