import { useForm } from "react-hook-form";
import { BrainLinkModalType } from "../types";
import { Add, Search, Share, Hamburger, Close } from "./icons";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useDebounceCallback } from "usehooks-ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ENV_VARS } from "../constants/envs";
import { useEffect } from "react";
import InputTags from "./ui/InputTags";

const Searchbar = ({
    token,
    setAddLinkModal,
    setBrainLinkModal,
    setSidebarOpen,
    sidebarOpen,
}: {
    sidebarOpen: boolean;
    token: string | null;
    setAddLinkModal: React.Dispatch<React.SetStateAction<boolean>>;
    setBrainLinkModal: React.Dispatch<React.SetStateAction<BrainLinkModalType>>;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const queryClient = useQueryClient();
    const { register, watch, setValue } = useForm<{
        title: string;
        tags: string[];
    }>();
    const title = watch("title", "");
    const tags = watch("tags", []);

    const mutation = useMutation({
        mutationFn: async ({ title }: { title: string; tags: string[] }) => {
            const { data } = await axios.post(
                `${ENV_VARS.BACKEND_URL}/content/search`,
                { title: title, tags: tags },
                { headers: { Authorization: token } }
            );
            return data.fetchedContent;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["userData"], data);
        },
    });

    const debouncedCallback = useDebounceCallback(() => {
        if (title.trim() !== "" || tags.length >= 1) {
            mutation.mutate({ title: title, tags: tags });
            return;
        }
        queryClient.invalidateQueries({ queryKey: ["userData"] });
    }, 300);

    useEffect(() => {
        debouncedCallback();
    }, [title, tags]);

    return (
        <div className="flex py-3 md:p-3 items-center justify-between gap-3">
            <span
                className="block lg:hidden cursor-pointer"
                onClick={() => setSidebarOpen((x) => !x)}
            >
                {sidebarOpen ? (
                    <Close className="motion-preset-fade-lg" />
                ) : (
                    <Hamburger className="motion-preset-fade-lg" />
                )}
            </span>
            <Input
                className="flex-1"
                placeholder="Search by title..."
                leftIcon={<Search />}
                {...register("title")}
            />
            <InputTags
                tags={tags}
                setValue={setValue}
                className="flex-1"
                placeholder="Search by tags..."
                leftIcon={<Search />}
            />
            <Button
                variant="Outline"
                title="Brain Link"
                leftIcon={<Share />}
                onClick={() => setBrainLinkModal((e) => ({ ...e, show: true }))}
            />
            <Button
                variant="Primary"
                title="Add Link"
                leftIcon={<Add />}
                onClick={() => setAddLinkModal(true)}
            />
        </div>
    );
};

export default Searchbar;
