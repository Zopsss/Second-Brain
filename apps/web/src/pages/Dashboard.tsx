import { useEffect, useState } from "react";
import AddLinkModal from "../components/AddLinkModal";
import LinkCard from "../components/LinkCard";
import Sidebar from "../components/Sidebar";
import Searchbar from "../components/Searchbar";
import BrainLinkModal from "../components/BrainLinkModal";
import Toast from "../components/Toast";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate } from "react-router";
import axios from "axios";
import { ENV_VARS } from "../constants/envs";
import { useQuery } from "@tanstack/react-query";
import { BrainLinkModalType } from "../types";

interface UserDataType {
    _id: string;
    createdAt: string;
    link: string;
    title: string;
    type: string;
    updatedAt: string;
    userId: string;
    tags: [{ _id: string; title: string }];
}

const Dashboard = () => {
    const [addLinkModal, setAddLinkModal] = useState(false);
    const [brainLink, setBrainLink] = useState<BrainLinkModalType>({
        show: false,
        link: null,
    });
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [link, setLink] = useState<{
        id: string;
        link: string;
        title: string;
    }>({ id: "", link: "", title: "" });
    const [toastMessage, setToastMessage] = useState<{
        id: number;
        toastMessage: string;
    }>({ id: 1, toastMessage: "" });

    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem("token")
    );

    useEffect(() => {
        if (!token) navigate("/login");
        setToken(token);

        const fetchBrainLink = async () => {
            try {
                const { data } = await axios.get(
                    `${ENV_VARS.BACKEND_URL}/brain/`,
                    {
                        headers: { Authorization: token },
                    }
                );

                console.log(fetchBrainLink);
                setBrainLink((e) => ({ ...e, link: data.brainLink.link }));
            } catch (error) {
                console.log("user doesnt have brain link.");
            }
        };

        fetchBrainLink();
    }, [token, navigate]);

    const fetchUserData = async () => {
        const { data } = await axios.get(`${ENV_VARS.BACKEND_URL}/content/`, {
            headers: {
                Authorization: token,
            },
        });
        return data.response;
    };

    const { isLoading, data, error } = useQuery<UserDataType[]>({
        queryKey: ["userData"],
        queryFn: fetchUserData,
        enabled: !!token,
    });

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
                            sidebarOpen={sidebarOpen}
                            token={token}
                            setAddLinkModal={setAddLinkModal}
                            setBrainLinkModal={setBrainLink}
                            setSidebarOpen={setSidebarOpen}
                        />
                    </div>
                    {isLoading ? (
                        <div className="flex-1 flex justify-center items-start mt-5">
                            <span className="text-lg font-semibold">
                                Loading...
                            </span>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex justify-center items-center nt-5">
                            <span className="text-lg text-red-500 font-semibold">
                                Error: {error.message}
                            </span>
                        </div>
                    ) : data?.length === 0 || data === undefined ? (
                        <div className="flex-1 flex justify-center items-center text-center">
                            <h1 className="font-semibold text-lg">
                                Seems like you haven't stored any links yet.
                                <br />
                                Click on "Add Link" button to start storing your
                                links.
                            </h1>
                        </div>
                    ) : (
                        <div className="p-6 overflow-y-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {data.map((link) => (
                                <LinkCard
                                    key={link._id}
                                    title={link.title}
                                    link={link.link}
                                    tags={link.tags}
                                    id={link._id}
                                    setLink={setLink}
                                    setShowConfirmationModal={
                                        setShowConfirmationModal
                                    }
                                />
                            ))}
                        </div>
                    )}
                </main>

                {brainLink.show && (
                    <BrainLinkModal
                        token={token}
                        brainLink={brainLink}
                        setBrainLink={setBrainLink}
                        setShowToast={setShowToast}
                        setToastMessage={setToastMessage}
                    />
                )}
                {addLinkModal && (
                    <AddLinkModal
                        token={token}
                        setAddLinkModal={setAddLinkModal}
                    />
                )}
                {showToast && (
                    <Toast
                        setShowToast={setShowToast}
                        toastMessage={toastMessage}
                    />
                )}
                {showConfirmationModal && (
                    <ConfirmationModal
                        link={link}
                        token={token}
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
