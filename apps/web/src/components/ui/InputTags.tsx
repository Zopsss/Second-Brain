import { forwardRef, ReactElement, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import { Close } from "../icons";

interface ContentType {
    title: string;
    link?: string;
    tags: string[];
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon: ReactElement;
    setValue: UseFormSetValue<ContentType>;
    tags: string[];
}

const InputTags = forwardRef<HTMLInputElement, InputProps>(
    ({ leftIcon, tags, setValue, className, ...props }) => {
        const inputRef = useRef<HTMLInputElement>(null);
        // const tags = watch?.("tags", [] as string[]) || ([] as string[]);

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
                                    <div
                                        key={tag}
                                        className="cursor-pointer flex gap-2 items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md"
                                    >
                                        <span className="text-xs text-nowrap">
                                            {tag}
                                        </span>
                                        <span
                                            onClick={() =>
                                                setValue?.(
                                                    "tags",
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

                                const value = (
                                    e.target as HTMLInputElement
                                ).value.trim();

                                if (value === "" || tags.includes(value))
                                    return;

                                setValue?.("tags", [...tags, value]);
                                inputElement.value = "";
                            }

                            if (
                                e.key === "Backspace" &&
                                inputElement.value === ""
                            ) {
                                setValue?.("tags", tags.slice(0, -1));
                            }
                        }}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);

export default InputTags;
