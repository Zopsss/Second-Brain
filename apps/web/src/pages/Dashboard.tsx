import { useState } from "react";
import AddLinkModal from "../components/AddLinkModal";
import LinkCard from "../components/LinkCard";
import Sidebar from "../components/Sidebar";
import { data } from "./data";
import Searchbar from "../components/Searchbar";
import BrainLinkModal from "../components/BrainLinkModal";
import Toast from "../components/Toast";
import ConfirmationModal from "../components/ConfirmationModal";

const Dashboard = () => {
    const [addLinkModal, setAddLinkModal] = useState(false);
    const [showBrainLinkModal, setShowBrainLinkModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [link, setLink] = useState(
        "https://youtu.be/t8655cvDc48?si=ZmEKfWw7X6kCcGaq"
    );
    const [title, setTitle] = useState("Nenu's story");

    const [toastMessage, setToastMessage] = useState<{
        id: number;
        toastMessage: string;
    }>({ id: 1, toastMessage: "" });

    return (
        <>
            <div className="h-[calc(100vh-64px)] bg-slate-50 flex">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <main className="flex-1 flex flex-col">
                    <div className="sticky top-16 border-b bg-white px-5 z-10">
                        <Searchbar
                            setAddLinkModal={setAddLinkModal}
                            setBrainLinkModal={setShowBrainLinkModal}
                            setSidebarOpen={setSidebarOpen}
                            sidebarOpen={sidebarOpen}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6 overflow-y-auto">
                        {data.map((l) => {
                            return (
                                <LinkCard
                                    setShowConfirmationModal={
                                        setShowConfirmationModal
                                    }
                                    title={title}
                                    link={link}
                                />
                            );
                        })}
                    </div>
                </main>

                {showBrainLinkModal && (
                    <BrainLinkModal
                        setShowBrainLinkModal={setShowBrainLinkModal}
                        setShowToast={setShowToast}
                        setToastMessage={setToastMessage}
                    />
                )}
                {addLinkModal && (
                    <AddLinkModal setAddLinkModal={setAddLinkModal} />
                )}
                {showToast && (
                    <Toast
                        setShowToast={setShowToast}
                        toastMessage={toastMessage}
                    />
                )}
                {showConfirmationModal && (
                    <ConfirmationModal
                        title={title}
                        link={link}
                        setShowConfirmationModal={setShowConfirmationModal}
                        setShowToast={setShowToast}
                        setToastMessage={setToastMessage}
                    />
                )}
            </div>
        </>
    );
};

export default Dashboard;
