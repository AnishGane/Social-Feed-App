import { useAppSelector } from "@/hooks"
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const { accessToken } = useAppSelector(state => state.auth);
    if (accessToken) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default PublicRoute