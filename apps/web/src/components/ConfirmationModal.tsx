import { Close } from "./icons";
import Button from "./ui/Button";
import { useOnClickOutside } from "usehooks-ts";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ENV_VARS } from "../constants/envs";

interface LinkType {
    id: string;
    link: string;
    title: string;
}

const ConfirmationModal = ({
    link,
    token,
    setShowConfirmationModal,
    setShowToast,
    setToastMessage,
}: {
    link: LinkType;
    token: string | null;
    setShowConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    setToastMessage: React.Dispatch<
        React.SetStateAction<{ id: number; toastMessage: string }>
    >;
}) => {
    const modalRef = useRef(null);

    useOnClickOutside(modalRef, () => setShowConfirmationModal(false));

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: LinkType) => {
            return await axios.delete(`${ENV_VARS.BACKEND_URL}/content/`, {
                data: { contentId: data.id },
                headers: {
                    Authorization: token,
                },
            });
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["userData"] }),
        onError: (error) => {
            alert("Link not deleted, please try again.");
            console.log(error);
        },
    });

    const handleDeleteLink = () => {
        // console.log("object");
        mutation.mutate(link);
        setToastMessage({
            id: Date.now(),
            toastMessage: "Link deleted successfully!",
        });
        setShowToast(true);
        setShowConfirmationModal(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex items-center justify-center p-4 z-20">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-lg modal-animation"
            >
                <div className="flex flex-col items-center justify-center gap-5 mb-5">
                    <div className="flex w-full justify-end mr-8 mt-4">
                        <button
                            className="cursor-pointer"
                            onClick={() => setShowConfirmationModal(false)}
                        >
                            <Close />
                        </button>
                    </div>
                    <div className="px-10 py-4">
                        <h1 className="font-bold text-center mb-4">
                            Are you sure you want to delete this link?
                        </h1>
                        <hr />
                        <div className="mt-4">
                            <div className="flex gap-2 items-center mb-3">
                                <h1 className="font-bold">Title: </h1>
                                <h1 className="font-bold text-sm">
                                    {link.title}
                                </h1>
                            </div>
                            <div className="flex gap-2 items-center">
                                <h1 className="font-bold">Link: </h1>
                                <a
                                    className="font-bold text-sm text-purple-600"
                                    href={link.link}
                                    target="_blank"
                                >
                                    {link.link}
                                </a>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-5">
                            <Button
                                title="Yes"
                                variant="Primary"
                                className="w-full"
                                onClick={handleDeleteLink}
                            />
                            <Button
                                title="No"
                                variant="Primary"
                                className="w-full"
                                onClick={() => setShowConfirmationModal(false)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
