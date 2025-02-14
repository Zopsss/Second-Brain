import LinkCard from "../components/LinkCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";
import { ENV_VARS } from "../constants/envs";

interface BrainLinkType {
    _id: string;
    link: string;
    title: string;
    type: string;
    tags: [{ _id: string; title: string }];
}

const Brain = () => {
    const { brainLink } = useParams();
    const { isLoading, error, data } = useQuery<BrainLinkType[]>({
        queryKey: ["brainContent"],
        queryFn: async () => {
            const { data } = await axios.get(
                `${ENV_VARS.BACKEND_URL}/brain/${brainLink}`
            );

            return data.brainContent;
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center font-bold mt-6">
                Loading....
            </div>
        );
    }

    if (error) {
        if (axios.isAxiosError(error)) {
            return (
                <div className="flex justify-center font-bold mt-6">
                    {error.response?.data.msg}
                </div>
            );
        }
        return (
            <div className="flex justify-center font-bold mt-6">
                {error.message}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex justify-center font-bold mt-6">
                Oops, looks like user doesn't have stored any links yet ;-;
            </div>
        );
    }

    return (
        <div className="grid p-6 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((link) => {
                return (
                    <LinkCard
                        key={link._id}
                        type={link.type}
                        title={link.title}
                        link={link.link}
                        tags={link.tags}
                    />
                );
            })}
        </div>
    );
};

export default Brain;
