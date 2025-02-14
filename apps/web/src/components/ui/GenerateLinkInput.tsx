import React from "react";
import { Copy } from "../icons";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    brainLink: string;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    setToastMessage: React.Dispatch<
        React.SetStateAction<{ id: number; toastMessage: string }>
    >;
}

const GenerateLinkInput: React.FC<InputProps> = ({
    brainLink,
    setToastMessage,
    setShowToast,
    ...props
}) => {
    return (
        <div className="flex flex-1 items-center justify-between relative group">
            <input
                className="border border-slate-300 rounded-md focus:outline-none pr-10 pl-4 pt-1 pb-[0.40rem] w-full focus:border-purple-400"
                {...props}
                value={brainLink}
            />
            <div className="absolute right-2 flex gap-3 text-gray-600/90">
                <span
                    className="cursor-pointer hover:scale-110 transition-all duration-200"
                    onClick={() => {
                        if (brainLink) {
                            navigator.clipboard.writeText(brainLink);
                            setToastMessage({
                                toastMessage: "Brain Link Copied To Clipboard!",
                                id: Date.now(),
                            });
                            setShowToast(true);
                        }
                    }}
                >
                    <Copy />
                </span>
            </div>
        </div>
    );
};

export default GenerateLinkInput;
