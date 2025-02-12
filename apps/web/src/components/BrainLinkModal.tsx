import { Close } from "./icons";
import Button from "./ui/Button";
import { useOnClickOutside } from "usehooks-ts";
import { useEffect, useRef, useState } from "react";
import GenerateLinkInput from "./ui/GenerateLinkInput";
import axios from "axios";
import { ENV_VARS } from "../constants/envs";
import { BrainLinkModalType } from "../types";

const BrainLinkModal = ({
    token,
    brainLink,
    setBrainLink,
    setShowToast,
    setToastMessage,
}: {
    token: string | null;
    brainLink: BrainLinkModalType;
    setBrainLink: React.Dispatch<React.SetStateAction<BrainLinkModalType>>;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    setToastMessage: React.Dispatch<
        React.SetStateAction<{ id: number; toastMessage: string }>
    >;
}) => {
    const modalRef = useRef(null);
    const [isBrainEnabled, setIsBrainEnabled] = useState(true);

    useOnClickOutside(modalRef, () =>
        setBrainLink((e) => ({ ...e, show: false }))
    );

    useEffect(() => {
        const updateShareStatus = async () => {
            const { data } = await axios.put(
                `${ENV_VARS.BACKEND_URL}/brain/update-share`,
                { share: isBrainEnabled },
                { headers: { Authorization: token } }
            );

            console.log(data);
        };
        updateShareStatus();
    }, [isBrainEnabled]);

    const generateBrainLink = async () => {
        const { data } = await axios.post(
            `${ENV_VARS.BACKEND_URL}/brain/`,
            {},
            {
                headers: { Authorization: token },
            }
        );

        setBrainLink((e) => ({ ...e, link: data.brainLink.link }));
        setToastMessage({
            id: Date.now(),
            toastMessage: "Brain Link Generated.",
        });
        setShowToast(true);
    };

    const handleRegenerateBrainLink = async () => {
        const { data } = await axios.put(
            `${ENV_VARS.BACKEND_URL}/brain/regenerate-link`,
            {},
            { headers: { Authorization: token } }
        );

        console.log(data);
        setBrainLink((e) => ({ ...e, link: data.newBrainLink.link }));
        setToastMessage({
            toastMessage: "Brain Link Regnerated.",
            id: Date.now(),
        });
    };

    const MiddleContent = () => {
        if (brainLink.link) {
            return (
                <>
                    <div className="flex items-center justify-between gap-5 mb-5">
                        <h1 className="font-semibold">Brain Link</h1>
                        <button
                            className="cursor-pointer"
                            onClick={() => {
                                setBrainLink((e) => ({ ...e, show: false }));
                            }}
                        >
                            <Close />
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p>Enable Sharing Brain Link.</p>
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
                            {isBrainEnabled && brainLink.link && (
                                <GenerateLinkInput
                                    brainLink={brainLink.link}
                                    setShowToast={setShowToast}
                                    setToastMessage={setToastMessage}
                                    disabled
                                />
                            )}
                        </div>
                        <Button
                            variant="Primary"
                            title="Regenerate Link"
                            onClick={handleRegenerateBrainLink}
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
                        onClick={() =>
                            setBrainLink((e) => ({ ...e, show: false }))
                        }
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
