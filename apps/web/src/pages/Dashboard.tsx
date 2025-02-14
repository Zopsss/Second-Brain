import { useEffect, useState } from "react";
import AddLinkModal from "../components/AddLinkModal";
import LinkCard from "../components/LinkCard";
import Sidebar from "../components/Sidebar";
import Searchbar from "../components/Searchbar";
import BrainLinkModal from "../components/BrainLinkModal";
import Toast from "../components/Toast";
import DeleteLinkModal from "../components/DeleteLinkModal";
import { useNavigate } from "react-router";
import axios from "axios";
import { ENV_VARS } from "../constants/envs";
import { useQuery } from "@tanstack/react-query";
import { BrainLinkModalType, SetLinkType, TagsType } from "../types";
import UpdateModal from "../components/UpdateLinkModal";

interface ContentDataType {
    _id: string;
    createdAt: string;
    link: string;
    title: string;
    type: string;
    updatedAt: string;
    userId: string;
    tags: TagsType[];
}

const Dashboard = () => {
    const [addLinkModal, setAddLinkModal] = useState(false);
    const [brainLink, setBrainLink] = useState<BrainLinkModalType>({
        show: false,
        link: null,
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [activeItem, setActiveItem] = useState("all-links");
    const [link, setLink] = useState<SetLinkType>({
        id: "",
        link: "",
        title: "",
        tags: [],
    });
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

                setBrainLink((e) => ({ ...e, link: data.brainLink.link }));
            } catch (error) {}
        };

        fetchBrainLink();

        const queryParam = new URLSearchParams(window.location.search);
        const active = queryParam.get("active");

        if (active) {
            setActiveItem(active);
        } else {
            const newUrl = `${window.location.pathname}?active=all-links`;
            window.history.replaceState(null, "", newUrl);
            setActiveItem("all-links");
        }
    }, [token, navigate]);

    const fetchUserData = async () => {
        const { data } = await axios.get(
            `${ENV_VARS.BACKEND_URL}/content/${activeItem}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        return data.response;
    };

    const { isLoading, data, error } = useQuery<ContentDataType[]>({
        queryKey: ["userData"],
        queryFn: fetchUserData,
        enabled: !!token,
    });

    return (
        <>
            <div className="h-[calc(100vh-64px)] bg-slate-50 flex">
                <Sidebar
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
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
                    ) : data === undefined || data.length === 0 ? (
                        <div className="flex-1 flex justify-center items-center text-center">
                            <h1 className="font-semibold text-lg">
                                Oops looks like there is no Content ;-;
                            </h1>
                        </div>
                    ) : (
                        <div className="p-6 overflow-y-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {data.map((link) => {
                                return (
                                    <LinkCard
                                        key={link._id}
                                        title={link.title}
                                        link={link.link}
                                        type={link.type}
                                        tags={link.tags}
                                        id={link._id}
                                        setLink={setLink}
                                        setShowDeleteModal={setShowDeleteModal}
                                        setShowUpdateModal={setShowUpdateModal}
                                    />
                                );
                            })}
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
                        setShowToast={setShowToast}
                        setToastMessage={setToastMessage}
                    />
                )}
                {showToast && (
                    <Toast
                        setShowToast={setShowToast}
                        toastMessage={toastMessage}
                    />
                )}
                {showDeleteModal && (
                    <DeleteLinkModal
                        link={link}
                        token={token}
                        setShowDeleteModal={setShowDeleteModal}
                        setShowToast={setShowToast}
                        setToastMessage={setToastMessage}
                    />
                )}
                {showUpdateModal && (
                    <UpdateModal
                        link={link}
                        token={token}
                        setUpdateModal={setShowUpdateModal}
                        setShowToast={setShowToast}
                        setToastMessage={setToastMessage}
                    />
                )}
            </div>
        </>
    );
};

export default Dashboard;
