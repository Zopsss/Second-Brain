import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = ({ isAuth }: { isAuth: boolean }) => {
    return isAuth === true ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
