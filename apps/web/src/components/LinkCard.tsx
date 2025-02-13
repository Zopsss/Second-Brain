import { Tag, YouTube } from "./icons";
import Delete from "./icons/Delete";

const LinkCard = ({
    id,
    link,
    title,
    tags,
    setShowConfirmationModal,
    setLink,
}: {
    id?: string;
    title: string;
    link: string;
    tags: [{ _id: string; title: string }];
    setShowConfirmationModal?: React.Dispatch<React.SetStateAction<boolean>>;
    setLink?: React.Dispatch<
        React.SetStateAction<{
            id: string;
            link: string;
            title: string;
        }>
    >;
}) => {
    return (
        <div className="bg-white p-5 rounded-lg drop-shadow-md hover:drop-shadow-lg transition-all duration-200">
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-slate-500">
                            <YouTube />
                        </div>
                        <h1 className="break-all">{title}</h1>
                    </div>
                    {setShowConfirmationModal && id && (
                        <div
                            className="cursor-pointer text-slate-700"
                            onClick={() => {
                                setShowConfirmationModal(true);
                                setLink?.({ id, title, link });
                            }}
                        >
                            <Delete />
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-purple-600 w-fit ml-9 mt-1">
                        <a href={link} target="_blank" className="break-all">
                            {link}
                        </a>
                    </p>
                </div>
            </div>
            <div className="mt-4 flex gap-1 flex-wrap">
                {tags.map((tag) => {
                    return (
                        <div
                            key={tag._id}
                            className="w-fit flex gap-2 items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md"
                        >
                            <span>
                                <Tag />
                            </span>
                            <span className="text-[0.70rem]">{tag.title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LinkCard;
