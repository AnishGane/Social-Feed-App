import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./protected-route";
import AppLayout from "@/layouts/app-layout";
import PublicRoute from "./public-route";
import AuthLayout from "@/layouts/auth-layout";
import AuthPage from "@/pages/auth";

export const router = createBrowserRouter([
    {
        element: (
            <ProtectedRoutes>
                <AppLayout />
            </ProtectedRoutes>
        ),

        children: [
            {
                path: "/",
                element: <h1>Dashboard</h1>
            },
            {
                path: "/profile",
                element: <h1>Profile</h1>
            },
            {
                path: "/bookmarks",
                element: <h1>Bookmarks</h1>
            },
            {
                path: "/settings",
                element: <h1>Settings</h1>
            }
        ]
    },

    {
        element: (
            <PublicRoute>
                <AuthLayout />
            </PublicRoute>
        ),

        children: [
            {
                path: "/auth",
                element: <AuthPage />
            }
        ]
    },

    {
        path: "*",
        element: <h1>404</h1>,
    },
])