import { SetLinkType, TagsType } from "../types";
import {
    Instagram,
    Link,
    Notion,
    Pencil,
    Reddit,
    Tag,
    X,
    YouTube,
} from "./icons";
import Delete from "./icons/Delete";

const linkTypeMap = new Map([
    ["YouTube", <YouTube />],
    ["Instagram", <Instagram />],
    ["X", <X />],
    ["Reddit", <Reddit />],
    ["Notion", <Notion />],
    ["Others", <Link />],
]);

const LinkCard = ({
    id,
    link,
    title,
    type,
    tags,
    setShowDeleteModal,
    setShowUpdateModal,
    setLink,
}: {
    id?: string;
    title: string;
    link: string;
    type: string;
    tags: TagsType[];
    setShowDeleteModal?: React.Dispatch<React.SetStateAction<boolean>>;
    setShowUpdateModal?: React.Dispatch<React.SetStateAction<boolean>>;
    setLink?: React.Dispatch<React.SetStateAction<SetLinkType>>;
}) => {
    return (
        <div className="bg-white p-5 rounded-lg drop-shadow-md hover:drop-shadow-lg transition-all duration-200">
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-slate-500">
                            {linkTypeMap.get(type)}
                        </div>
                        <h1 className="break-all">{title}</h1>
                    </div>
                    {setShowDeleteModal &&
                        setShowUpdateModal &&
                        setLink &&
                        id && (
                            <div className="cursor-pointer text-slate-700 flex items-center gap-2">
                                <span
                                    onClick={() => {
                                        setShowUpdateModal(true);
                                        setLink({ id, title, link, tags });
                                    }}
                                >
                                    <Pencil />
                                </span>
                                <span
                                    onClick={() => {
                                        setShowDeleteModal(true);
                                        setLink({ id, title, link, tags });
                                    }}
                                >
                                    <Delete />
                                </span>
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
