import { useState } from "react";
import LinkCard from "../components/LinkCard";
import { data } from "./data";

const Brain = () => {
    const [link, setLink] = useState(
        "https://www.instagram.com/stories/highlights/17973534050748450/"
    );
    const [title, setTitle] = useState("Nenu's story");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
            {data.map((l) => {
                return <LinkCard title={title} link={link} />;
            })}
            ;
        </div>
    );
};

export default Brain;
