import { useAppSelector } from "@/hooks"
import type React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { accessToken } = useAppSelector(state => state.auth);
    if (accessToken) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicRoute