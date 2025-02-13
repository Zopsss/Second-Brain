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
            console.log(data);
            return data.brainContent;
        },
    });

    return (
        <div
            className={`grid p-6 ${((isLoading || error) && "w-full text-center") || (data && data.length > 0 && "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3")}`}
        >
            {isLoading ? (
                <h1 className="font-bold">Loading....</h1>
            ) : error ? (
                <h1>{error.message}</h1>
            ) : (
                data?.map((link) => {
                    return (
                        <LinkCard
                            key={link._id}
                            title={link.title}
                            link={link.link}
                            tags={link.tags}
                        />
                    );
                })
            )}
        </div>
    );
};

export default Brain;
