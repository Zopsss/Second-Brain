import { Navigate, Route, Routes } from "react-router";
import Brain from "./pages/Brain";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Navbar from "./components/Navbar";

const client = new QueryClient();

function App() {
    const [isAuth, setIsAuth] = useState<boolean>(() => {
        return !!localStorage.getItem("token");
    });

    return (
        <QueryClientProvider client={client}>
            <Navbar setIsAuth={setIsAuth} isAuth={isAuth} />
            <Routes>
                <Route path="/" element={<LandingPage isAuth={isAuth} />} />
                <Route path="/share/:brainLink" element={<Brain />} />
                <Route
                    path="/signup"
                    element={
                        isAuth ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <SignUp setIsAuth={setIsAuth} />
                        )
                    }
                />
                <Route
                    path="/login"
                    element={
                        isAuth ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Login setIsAuth={setIsAuth} />
                        )
                    }
                />
                <Route element={<ProtectedRoutes isAuth={isAuth} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </QueryClientProvider>
    );
}

export default App;
