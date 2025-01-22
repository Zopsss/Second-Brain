import { Notion, Reddit, Tag, YouTube } from "./icons";

const LinkCard = () => {
    return (
        <div className="bg-white h-fit w-[32%] max-h-fit p-5 rounded-lg drop-shadow-md hover:drop-shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
                <div className="text-slate-500">
                    <YouTube />
                </div>
                <div>
                    <h1 className="mb-1 tracking-wide text-sm">
                        I have achieved Infinite Heal
                    </h1>
                    <p className="text-xs text-purple-600">
                        <a
                            href="https://youtu.be/nyw9i7VUiVE?si=n7_IPwVeDbB48bVL"
                            target="_blank"
                        >
                            https://youtu.be/nyw9i7VUiVE?si=n7_IPwVeDbB48bVL
                        </a>
                    </p>
                </div>
            </div>
            <div className="mt-4 flex gap-1 flex-wrap">
                <div className="cursor-pointer w-fit flex gap-2 items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-xl">
                    <span>
                        <Tag />
                    </span>
                    <span className="text-[0.70rem]">Tugg Speedman</span>
                </div>
                <div className="cursor-pointer w-fit flex gap-2 items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-xl">
                    <span>
                        <Tag />
                    </span>
                    <span className="text-[0.70rem]">Movis The Dog</span>
                </div>
                <div className="cursor-pointer w-fit flex gap-2 items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-xl">
                    <span>
                        <Tag />
                    </span>
                    <span className="text-[0.70rem]">
                        Neko Neko Cutiee Nenuuu-chaaannn
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LinkCard;
