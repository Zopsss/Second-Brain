import { useEffect, useRef, useState } from "react";
import { Instagram, YouTube, Reddit, Notion, X, Link } from "./icons";
import { useOnClickOutside } from "usehooks-ts";

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const sidebarItems = [
        ["all-links", "All links", <Link />],
        ["youtube", "YouTube", <YouTube />],
        ["instagram", "Instagram", <Instagram />],
        ["twitter", "X ( Twitter )", <X />],
        ["reddit", "Reddit", <Reddit />],
        ["notion", "Notion", <Notion />],
        ["others", "Others", <Link />],
    ];

    const [activeItem, setActiveItem] = useState("");

    const handleClick = (key: string) => {
        setActiveItem(key);
        const newUrl = `${window.location.pathname}?active=${key}`;
        window.history.replaceState(null, "", newUrl);
    };

    useEffect(() => {
        const queryParam = new URLSearchParams(window.location.search);
        const active = queryParam.get("active");

        if (active) {
            setActiveItem(active);
        } else {
            const newUrl = `${window.location.pathname}?active=all-links`;
            window.history.replaceState(null, "", newUrl);
            setActiveItem("all-links");
        }
    }, []);

    const sidebarRef = useRef(null);
    useOnClickOutside(sidebarRef, () => setSidebarOpen(false));

    return (
        <>
            <div
                ref={sidebarRef}
                className={`h-full min-w-fit fixed lg:sticky drop-shadow-xl lg:drop-shadow-none
                    top-[126px] lg:top-16 bg-white border-r px-3 pt-5 z-10
                    lg:motion-opacity-in-100
                    ${
                        sidebarOpen
                            ? "block motion-preset-slide-right"
                            : "motion-translate-x-out-[-100%] motion-duration-700 motion-opacity-out-0 motion-ease-in-out"
                    }
                    `}
            >
                <h1 className="font-semibold text-xl ml-3">My Links</h1>
                <div className="mt-6 w-56 flex flex-col gap-3">
                    {sidebarItems.map(([key, title, icon], index) => {
                        const isActiveItem = activeItem === key;

                        return (
                            <div
                                className={`flex items-center justify-between gap-5 font-semibold p-2 rounded-md cursor-pointer
                                ${
                                    isActiveItem
                                        ? "text-purple-500 bg-purple-50"
                                        : "text-gray-500 hover:bg-slate-50"
                                }`}
                                key={index}
                                onClick={() => handleClick(key as string)}
                            >
                                <div className="flex gap-4 items-center justify-center text-sm">
                                    <span>{icon}</span>
                                    <h1>{title}</h1>
                                </div>
                                <div className="bg-slate-100 px-2 text-sm rounded-full">
                                    1
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
