import Button from "./components/Button";
import Link from "./components/icons/Link";
import Search from "./components/icons/Search";
import Share from "./components/icons/Share";
import Shield from "./components/icons/Shield";
import Navbar from "./components/Navbar";

function App() {
    return (
        <>
            <Navbar />
            <main className="h-screen flex justify-center items-center">
                <div>
                    <h1 className="text-4xl font-bold text-center mb-5">
                        Your Digital Memory, <br /> Organized
                    </h1>
                    <p className="text-slate-800 font-light max-w-[70%] mx-auto text-center">
                        Store, organize, and share your favorite links from
                        across the web. Build your second brain with a simple,
                        beautiful interface.
                    </p>
                    <div className="flex gap-3 items-center justify-center mt-5">
                        <Button type="Primary" title="Get Started" />
                    </div>
                </div>
            </main>
            <div className="h-screen flex justify-center items-center">
                <div>
                    <h1 className="text-purple-600 font-semibold text-center">
                        Store Smarter
                    </h1>
                    <h1 className="text-4xl font-bold text-center mb-5">
                        Everything you need to organize your <br />
                        digital life
                    </h1>
                    <div className="grid grid-cols-2 gap-x-20 gap-y-20 max-w-[60%] place-items-center mx-auto mt-20">
                        <div className="flex gap-5">
                            <div className="bg-purple-500 px-3 py-2 w-fit h-fit text-white rounded-lg">
                                <Link />
                            </div>
                            <div>
                                <h5 className="font-semibold mb-1">
                                    Store any link
                                </h5>
                                <p className="text-gray-600 text-sm">
                                    Save links from YoutTube, Instagram, X,
                                    Notion, Reddit and more. Keep everything in
                                    one place.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className="bg-purple-500 px-3 py-2 w-fit h-fit text-white rounded-lg">
                                <Search />
                            </div>
                            <div>
                                <h5 className="font-semibold mb-1">
                                    Smart Search
                                </h5>
                                <p className="text-gray-600 text-sm">
                                    Find anything instantly with powerful search
                                    across titles and tags.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className="bg-purple-500 px-3 py-2 w-fit h-fit text-white rounded-lg">
                                <Share />
                            </div>
                            <div>
                                <h5 className="font-semibold mb-1">
                                    Share Your Brain
                                </h5>
                                <p className="text-gray-600 text-sm">
                                    Generate a unique link to share your curate
                                    collection with anyone.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className="bg-purple-500 px-3 py-2 w-fit h-fit text-white rounded-lg">
                                <Shield />
                            </div>
                            <div>
                                <h5 className="font-semibold mb-1">
                                    Privacy Control
                                </h5>
                                <p className="text-gray-600 text-sm">
                                    Full control over your shared links with the
                                    ability to disable or regenerate sharing
                                    links.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
