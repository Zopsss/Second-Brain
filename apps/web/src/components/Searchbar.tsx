import { useForm } from "react-hook-form";
import { BrainLinkModalType, TagsType } from "../types";
import { Add, Search, Share, Hamburger, Close } from "./icons";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useDebounceCallback } from "usehooks-ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ENV_VARS } from "../constants/envs";
import { useEffect, useState } from "react";
import InputTags from "./ui/InputTags";
import { SearchIcon } from "lucide-react";

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
    const [showSearchBar, setShowSearchbar] = useState(false);
    const queryClient = useQueryClient();
    const { register, watch, setValue } = useForm<{
        title: string;
        link: string;
        tags: TagsType[];
    }>();
    const title = watch("title", "");
    const tags = watch("tags", []);

    const mutation = useMutation({
        mutationFn: async ({ title }: { title: string; tags: TagsType[] }) => {
            const tagsTitles = tags.map((tag) => tag.title);
            const { data } = await axios.post(
                `${ENV_VARS.BACKEND_URL}/content/search`,
                { title: title, tags: tagsTitles },
                { headers: { Authorization: token } }
            );
            return data.fetchedContent;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["userData"], data);
        },
        onError: () => {
            // if no data found then show nothing
            queryClient.setQueryData(["userData"], []);
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
        <>
            <div className="flex py-3 md:p-3 items-center gap-3">
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
                <div className="flex items-center justify-end gap-3 w-full">
                    <div className="hidden md:grid grid-cols-1 flex-1 gap-2 lg:grid-cols-2">
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
                    </div>
                    <Button
                        className="block md:hidden"
                        variant="Outline"
                        title=""
                        leftIcon={<SearchIcon />}
                        onClick={() => setShowSearchbar((state) => !state)}
                    />
                    <Button
                        variant="Outline"
                        title="Brain Link"
                        leftIcon={<Share />}
                        onClick={() =>
                            setBrainLinkModal((e) => ({ ...e, show: true }))
                        }
                    />
                    <Button
                        variant="Primary"
                        title="Add Link"
                        leftIcon={<Add />}
                        onClick={() => setAddLinkModal(true)}
                    />
                </div>
            </div>
            <div
                className={`${showSearchBar ? "grid" : "hidden"}
                    md:hidden mb-3 grid-cols-1 flex-1 gap-2 lg:grid-cols-2`}
            >
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
            </div>
        </>
    );
};

export default Searchbar;
