import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./protected-route";
import AppLayout from "@/layouts/app-layout";
import PublicRoute from "./public-route";
import AuthLayout from "@/layouts/auth-layout";
import AuthPage from "@/pages/auth";
import HomePage from "@/pages/home";
import ProfilePage from "@/pages/profile";
import BookmarksPage from "@/pages/bookmarks";
import SettingsPage from "@/pages/settings";
import CreatePostPage from "@/pages/create-post";
import NotificationsPage from "@/pages/notifications";
import NotFoundPage from "@/pages/not-found";
import MyProfile from "@/pages/my-profile";
import PostDetailPage from "@/pages/post-detail";

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
                element: <HomePage />
            },
            {
                path: "/u/me",
                element: <MyProfile />
            },
            {
                path: "/bookmarks",
                element: <BookmarksPage />
            },
            {
                path: "/settings",
                element: <SettingsPage />
            },
            {
                path: "/create-post",
                element: <CreatePostPage />
            },
            {
                path: "/notifications",
                element: <NotificationsPage />
            },
            {
                path: "/u/:username",
                element: <ProfilePage />
            },
            {
                path: "/p/:postId",
                element: <PostDetailPage />
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
        element: <NotFoundPage />,
    },
])