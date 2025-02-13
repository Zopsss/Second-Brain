import Input from "./ui/Input";
import { Tag, Close, Pencil, Link2 } from "./icons";
import Button from "./ui/Button";
import { useOnClickOutside } from "usehooks-ts";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ENV_VARS } from "../constants/envs";
import InputTags from "./ui/InputTags";

interface ContentType {
    title: string;
    link?: string;
    tags: string[];
}

const AddLinkModal = ({
    setAddLinkModal,
    token,
}: {
    setAddLinkModal: React.Dispatch<React.SetStateAction<boolean>>;
    token: string | null;
}) => {
    const modalRef = useRef(null);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = useForm<ContentType>();
    const tags = watch("tags", []);

    useOnClickOutside(modalRef, () => setAddLinkModal(false));
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newData: ContentType) => {
            console.log(newData);
            return await axios.post(
                `${ENV_VARS.BACKEND_URL}/content/`,
                newData,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["userData"] }),
        onError: () =>
            setError("root", {
                message: "Failed to update content, please try again.",
            }),
    });

    const onSubmit: SubmitHandler<ContentType> = (data) => {
        mutation.mutate(data);
        setAddLinkModal(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex items-center justify-center p-4 z-20">
            <div
                ref={modalRef}
                className="bg-white max-w-md w-full rounded-lg shadow-lg p-4 modal-animation"
            >
                <div className="flex items-center justify-between gap-5 mb-5">
                    <h1 className="font-semibold">Add New Link</h1>
                    <button
                        className="cursor-pointer"
                        onClick={() => setAddLinkModal(false)}
                    >
                        <Close />
                    </button>
                </div>
                <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <label className="mb-1 text-sm tracking-wider">
                            URL
                        </label>
                        <Input
                            placeholder="https://example.com"
                            leftIcon={<Link2 />}
                            type="url"
                            {...register("link")}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 text-sm tracking-wider">
                            Title
                        </label>
                        <Input
                            placeholder="My Title..."
                            leftIcon={<Pencil />}
                            {...register("title")}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 text-sm tracking-wider">
                            Tags
                        </label>
                        <InputTags
                            tags={tags}
                            setValue={setValue}
                            placeholder="tag-1, tag-2, tag-3"
                            leftIcon={
                                <Tag width={17} height={17} strokeWidth={1.5} />
                            }
                        />
                    </div>
                    {errors.root && (
                        <span className="text-red-500 text-sm">
                            {errors.root.message}
                        </span>
                    )}
                    <Button variant="Primary" title="Add" type="submit" />
                </form>
            </div>
        </div>
    );
};

export default AddLinkModal;
