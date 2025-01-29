import { Tag, YouTube } from "./icons";
import Delete from "./icons/Delete";

const LinkCard = ({
    setShowConfirmationModal,
    link,
    title,
}: {
    title: string;
    link: string;
    setShowConfirmationModal?: React.Dispatch<React.SetStateAction<boolean>>;
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
                    {setShowConfirmationModal && (
                        <div
                            className="cursor-pointer text-slate-700"
                            onClick={() => setShowConfirmationModal(true)}
                        >
                            <Delete />
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm text-purple-600 w-fit">
                        <a href={link} target="_blank" className="break-all">
                            {link}
                        </a>
                    </p>
                </div>
            </div>
            <div className="mt-4 flex gap-1 flex-wrap">
                <div className="w-fit flex gap-2 items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                    <span>
                        <Tag />
                    </span>
                    <span className="text-[0.70rem]">Tugg Speedman</span>
                </div>
                <div className="w-fit flex gap-2 items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                    <span>
                        <Tag />
                    </span>
                    <span className="text-[0.70rem]">Movis The Dog</span>
                </div>
                <div className="w-fit flex gap-2 items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                    <span>
                        <Tag />
                    </span>
                    <span className="text-[0.70rem]">
                        Cutiieee Puttieee Nenuuu-chaaannn
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LinkCard;
