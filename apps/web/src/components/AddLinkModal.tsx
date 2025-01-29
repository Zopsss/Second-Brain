import Input from "./ui/Input";
import { Tag, Close, Pencil, Link2 } from "./icons";
import Button from "./ui/Button";
import { useOnClickOutside } from "usehooks-ts";
import { useRef, useState } from "react";

const AddLinkModal = ({
    setAddLinkModal,
}: {
    setAddLinkModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const modalRef = useRef(null);
    const [tags, setTags] = useState<string[]>([]);

    useOnClickOutside(modalRef, () => setAddLinkModal(false));

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
                    onSubmit={(e) => {
                        e.preventDefault();
                        setAddLinkModal(false);
                    }}
                >
                    <div>
                        <label className="mb-1 text-sm tracking-wider">
                            URL
                        </label>
                        <Input
                            placeholder="https://example.com"
                            leftIcon={<Link2 />}
                            type="url"
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
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 text-sm tracking-wider">
                            Tags
                        </label>
                        <Input
                            variant="tags"
                            tags={tags}
                            setTags={setTags}
                            placeholder="tag-1, tag-2, tag-3"
                            leftIcon={
                                <Tag width={17} height={17} strokeWidth={1.5} />
                            }
                        />
                    </div>
                    <Button variant="Primary" title="Add" type="submit" />
                </form>
            </div>
        </div>
    );
};

export default AddLinkModal;
