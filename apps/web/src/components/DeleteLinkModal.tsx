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

const DeleteLinkModal = ({
    link,
    token,
    setShowDeleteModal,
    setShowToast,
    setToastMessage,
}: {
    link: LinkType;
    token: string | null;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    setToastMessage: React.Dispatch<
        React.SetStateAction<{ id: number; toastMessage: string }>
    >;
}) => {
    const modalRef = useRef(null);

    useOnClickOutside(modalRef, () => setShowDeleteModal(false));

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
        onError: () => {
            setToastMessage({
                id: Date.now(),
                toastMessage: "Failed to delete link, please try again :(",
            });
            setShowToast(true);
        },
    });

    const handleDeleteLink = () => {
        mutation.mutate(link);
        setToastMessage({
            id: Date.now(),
            toastMessage: "Link deleted successfully!",
        });
        setShowToast(true);
        setShowDeleteModal(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex items-center justify-center p-4 z-20">
            <div
                ref={modalRef}
                className="bg-white max-w-md w-full rounded-lg shadow-lg p-4 modal-animation"
            >
                <div className="flex flex-col items-center justify-center gap-5 mb-5">
                    <div className="flex w-full justify-end mr-8 mt-4">
                        <button
                            className="cursor-pointer"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            <Close />
                        </button>
                    </div>
                    <div className="px-10 py-4">
                        <h1 className="font-bold text-center mb-4 text-wrap">
                            Are you sure you want to delete this link?
                        </h1>
                        <hr />
                        <div className="mt-4 text-wrap w-fit">
                            <div className="flex gap-2 items-center mb-3">
                                <h1 className="font-bold">Title: </h1>
                                <h1 className="font-bold text-sm text-wrap">
                                    {link.title}
                                </h1>
                            </div>
                            <div className="flex gap-2 items-center">
                                <h1 className="font-bold">Link: </h1>
                                <a
                                    className="font-bold text-sm text-purple-600 break-all"
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
                                onClick={() => setShowDeleteModal(false)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteLinkModal;
