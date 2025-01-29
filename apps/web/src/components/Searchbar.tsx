import { Add, Search, Share, Hamburger, Close } from "./icons";
import Button from "./ui/Button";
import Input from "./ui/Input";

const Searchbar = ({
    setAddLinkModal,
    setBrainLinkModal,
    setSidebarOpen,
    sidebarOpen,
}: {
    setAddLinkModal: React.Dispatch<React.SetStateAction<boolean>>;
    setBrainLinkModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sidebarOpen: boolean;
}) => {
    return (
        <div className="flex py-3 md:p-3 items-center justify-between gap-3">
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
            <Input
                className="flex-1"
                placeholder="Search by title or tags..."
                leftIcon={<Search />}
            />
            <Button
                variant="Outline"
                title="Brain Link"
                leftIcon={<Share />}
                onClick={() => setBrainLinkModal(true)}
            />
            <Button
                variant="Primary"
                title="Add Link"
                leftIcon={<Add />}
                onClick={() => setAddLinkModal(true)}
            />
        </div>
    );
};

export default Searchbar;
