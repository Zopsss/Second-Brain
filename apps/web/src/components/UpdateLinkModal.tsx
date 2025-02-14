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
import { ContentType, SetLinkType } from "../types";

const UpdateLinkModal = ({
    token,
    link,
    setUpdateModal,
    setShowToast,
    setToastMessage,
}: {
    link: SetLinkType;
    token: string | null;
    setUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    setToastMessage: React.Dispatch<
        React.SetStateAction<{ id: number; toastMessage: string }>
    >;
}) => {
    const modalRef = useRef(null);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ContentType>({
        defaultValues: {
            link: link.link,
            title: link.title,
            tags: link.tags,
        },
    });

    useOnClickOutside(modalRef, () => setUpdateModal(false));
    const queryClient = useQueryClient();
    const tags = watch("tags", link.tags);

    const mutation = useMutation({
        mutationFn: async (newData: ContentType) => {
            // TODO: fix any type
            const finalData: any = newData;
            finalData.tags = finalData.tags.map((tag: any) => tag.title);
            return await axios.put(
                `${ENV_VARS.BACKEND_URL}/content/`,
                finalData,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userData"] });
            setToastMessage({
                id: Date.now(),
                toastMessage: "Link updated successfully!",
            });
            setShowToast(true);
        },
        onError: () => {
            setToastMessage({
                id: Date.now(),
                toastMessage: "Failed to update link :(",
            });
            setShowToast(true);
        },
    });

    const onSubmit: SubmitHandler<ContentType> = (data) => {
        mutation.mutate({ ...data, contentId: link.id });
        setUpdateModal(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex items-center justify-center p-4 z-20">
            <div
                ref={modalRef}
                className="bg-white max-w-md w-full rounded-lg shadow-lg p-4 modal-animation"
            >
                <div className="flex items-center justify-between gap-5 mb-5">
                    <h1 className="font-semibold">Update Link</h1>
                    <button
                        className="cursor-pointer"
                        onClick={() => setUpdateModal(false)}
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
                            placeholder={link.link}
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
                            placeholder={link.title}
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

export default UpdateLinkModal;
