import { Dispatch, SetStateAction, useRef, useState } from "react";
import Close from "./icons/Close";
import Input from "./ui/Input";
import Link2 from "./icons/Link2";
import { Tag } from "./icons";
import Pencil from "./icons/Pencil";
import Button from "./ui/Button";
import { useDetectClickOutside } from "react-detect-click-outside";

const AddContentModal = ({
    modalOpen,
    setModalOpen,
}: {
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    // const dialogRef = useRef<React.RefObject<HTMLDialogElement>>();
    const reff = useDetectClickOutside({
        onTriggered: () => setModalOpen(false),
    });

    if (modalOpen) {
        console.log("neko");
        return (
            <div className="absolute translate-x-[40%] left-[25%] top-[25%] p-4 z-20">
                <div
                    ref={reff}
                    className="bg-white px-4 py-4 mx-auto min-w-fit shadow-lg border"
                >
                    <div className="flex items-center justify-between gap-5 mb-5">
                        <h1>Add New Link</h1>
                        <span
                            className="cursor-pointer"
                            // onClick={() => dialogRef.current?.close()}
                        >
                            <Close />
                        </span>
                    </div>
                    <form
                        className="flex flex-col gap-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            // dialogRef.current?.close();
                        }}
                    >
                        <div>
                            <h1 className="mb-1 text-sm tracking-wider">URL</h1>
                            <Input
                                placeholder="https://example.com"
                                leftIcon={<Link2 />}
                                type="url"
                            />
                        </div>
                        <div>
                            <h1 className="mb-1 text-sm tracking-wider">
                                Title
                            </h1>
                            <Input
                                placeholder="My Title..."
                                leftIcon={<Pencil />}
                            />
                        </div>
                        <div>
                            <h1 className="mb-1 text-sm tracking-wider">
                                Tags
                            </h1>
                            <Input
                                placeholder="tag-1, tag-2, tag-3"
                                leftIcon={
                                    <Tag
                                        width={17}
                                        height={17}
                                        strokeWidth={1.5}
                                    />
                                }
                            />
                        </div>
                        <Button variant="Primary" title="Add" type="submit" />
                    </form>
                </div>
            </div>
        );
    }
};

export default AddContentModal;
