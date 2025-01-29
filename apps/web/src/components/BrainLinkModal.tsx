import { Close } from "./icons";
import Button from "./ui/Button";
import { useOnClickOutside } from "usehooks-ts";
import { useEffect, useRef, useState } from "react";
import GenerateLinkInput from "./ui/GenerateLinkInput";

const BrainLinkModal = ({
    setShowBrainLinkModal,
    setShowToast,
    setToastMessage,
}: {
    setShowBrainLinkModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    setToastMessage: React.Dispatch<
        React.SetStateAction<{ id: number; toastMessage: string }>
    >;
}) => {
    const modalRef = useRef(null);
    const [brainLink, setBrainLink] = useState<string>();
    const [isBrainEnabled, setIsBrainEnabled] = useState(true);

    useOnClickOutside(modalRef, () => setShowBrainLinkModal(false));

    const generateBrainLink = () => {
        // generate user's brain link.
        setBrainLink(
            // `Cutie Putiee Nekoo Nennuuu ${Math.floor(Math.random() * 10)}`
            "https://second-brain/share/5c73bbe9-7075-4981-812d-dbe90ed63b8e"
        );
        setToastMessage({
            id: Date.now(),
            toastMessage: "Brain Link Generated.",
        });
        setShowToast(true);
    };

    useEffect(() => {
        // check if user has generated brain link or not
        // if not then show "generate link" button
        // if yes then get the link
        // set isBrainEnabled based on if link is shareable or not
        // and set the brainLink
    }, []);

    const MiddleContent = () => {
        if (brainLink) {
            return (
                <>
                    <div className="flex items-center justify-between gap-5 mb-5">
                        <h1 className="font-semibold">Brain Link</h1>
                        <button
                            className="cursor-pointer"
                            onClick={() => {
                                setBrainLink("Neko Nennuu soo cuttieee");
                                setShowBrainLinkModal(false);
                            }}
                        >
                            <Close />
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p>Enable Brain Link.</p>
                            <span className="cursor-pointer transition-all">
                                <button
                                    onClick={() =>
                                        setIsBrainEnabled(!isBrainEnabled)
                                    }
                                    className={`${
                                        isBrainEnabled
                                            ? "bg-purple-600"
                                            : "bg-gray-200"
                                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                                >
                                    <span
                                        className={`${
                                            isBrainEnabled
                                                ? "translate-x-5"
                                                : "translate-x-0"
                                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-all duration-200 ease-in-out`}
                                    />
                                </button>
                            </span>
                        </div>
                        <div>
                            {isBrainEnabled && (
                                <GenerateLinkInput
                                    value={brainLink}
                                    brainLink={brainLink}
                                    generateBrainLink={generateBrainLink}
                                    setShowToast={setShowToast}
                                    setToastMessage={setToastMessage}
                                    disabled
                                />
                            )}
                        </div>
                        <Button
                            variant="Primary"
                            title="Regenerate Link"
                            onClick={() => {
                                setToastMessage({
                                    toastMessage: "Brain Link Regnerated.",
                                    id: Date.now(),
                                });
                                setShowToast(true);
                            }}
                        />
                    </div>
                </>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center gap-5 mb-5">
                <div className="flex w-full justify-end">
                    <button
                        className="cursor-pointer"
                        onClick={() => setShowBrainLinkModal(false)}
                    >
                        <Close />
                    </button>
                </div>
                <div className="px-10 py-4">
                    <h1 className="font-bold text-xl text-center mb-4">
                        Oops, it seems like you haven't generated your Brain
                        Link.
                    </h1>
                    <Button
                        title="Generate Now"
                        variant="Primary"
                        className="w-full text-[1.20rem]"
                        onClick={generateBrainLink}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex items-center justify-center p-4 z-20">
            <div
                ref={modalRef}
                className="bg-white max-w-md w-full rounded-lg shadow-lg p-4 modal-animation"
            >
                <MiddleContent />
            </div>
        </div>
    );
};

export default BrainLinkModal;
