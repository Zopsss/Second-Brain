import { useEffect, useState } from "react";
import { Close } from "./icons";

const Toast = ({
    toastMessage,
}: {
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    toastMessage: { id: number; toastMessage: string };
}) => {
    const [messages, setMessages] = useState<
        { id: number; toastMessage: string }[]
    >([]);

    useEffect(() => {
        if (toastMessage) {
            setMessages((msgs) => [...msgs, toastMessage]);

            setTimeout(() => {
                setMessages((msgs) =>
                    msgs.filter((msg) => msg.id !== toastMessage.id)
                );
            }, 3000);
        }
    }, [toastMessage]);

    const handleClose = (id: number) => {
        setMessages((msgs) => msgs.filter((msg) => msg.id !== id));
    };

    return (
        <div className="absolute bottom-5 right-5 flex gap-1 flex-col">
            {messages.map(({ id, toastMessage }) => (
                <div
                    key={id}
                    className="flex items-center justify-between bg-white border border-slate-300 p-5 w-96 rounded-lg z-50 drop-shadow-lg motion-preset-slide-left-sm transition-all"
                >
                    <div>
                        <h1 className="font-semibold text-left">
                            {toastMessage}
                        </h1>
                    </div>
                    <div
                        className="cursor-pointer border border-slate-300 text-slate-600/90 rounded-md p-1 hover:bg-slate-50"
                        onClick={() => handleClose(id)}
                    >
                        <Close />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Toast;
