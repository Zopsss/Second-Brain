import { Dispatch, SetStateAction } from "react";
import { Add, Search, Share } from "./icons";
import Button from "./ui/Button";
import Input from "./ui/Input";

const Searchbar = ({
    setModalOpen,
}: {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <div className="flex p-3 items-center justify-between gap-3">
            <Input
                className="flex-1"
                placeholder="Search by title or tags..."
                leftIcon={<Search />}
            />
            <Button variant="Outline" title="Brain Link" leftIcon={<Share />} />
            <Button
                variant="Primary"
                title="Add Link"
                leftIcon={<Add />}
                onClick={() => {
                    console.log("object");
                    setModalOpen(true);
                }}
            />
        </div>
    );
};

export default Searchbar;
