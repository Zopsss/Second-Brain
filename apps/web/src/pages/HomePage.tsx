import { useState } from "react";
import AddContentModal from "../components/AddContentModal";
import LinkCard from "../components/LinkCard";
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import { data } from "./data";

const HomePage = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="h-[calc(100vh-64px)] bg-slate-50 flex">
            <AddContentModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
            <Sidebar />
            <main className="flex-1 flex flex-col">
                <div className="sticky top-16 border-b bg-white px-5 z-10">
                    <Searchbar setModalOpen={setModalOpen} />
                </div>
                <div className="px-5 py-3 overflow-y-auto flex flex-wrap gap-4 items-start">
                    {data.map((link) => {
                        return <LinkCard />;
                    })}
                </div>
            </main>
        </div>
    );
};

export default HomePage;
