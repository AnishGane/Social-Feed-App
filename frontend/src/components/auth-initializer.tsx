import { logout, setCredentials } from "@/features/auth/auth-slice";
import { useAppDispatch } from "@/hooks";
import { useLazyMeQuery, useRefreshMutation } from "@/services/auth-api";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const AuthInitializer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [loading, setLoading] = useState(true);
    const [refresh] = useRefreshMutation();
    const initialized = useRef(false);

    const dispatch = useAppDispatch();

    const [getMe] = useLazyMeQuery();

    useEffect(() => {
        if (initialized.current) return;

        initialized.current = true;
        const initAuth = async () => {
            try {
                const refreshRes = await refresh().unwrap();

                const token = refreshRes.data.accessToken;

                dispatch(
                    setCredentials({
                        user: null,
                        accessToken: token,
                    })
                );

                const meRes = await getMe().unwrap();

                dispatch(
                    setCredentials({
                        user: meRes.data,
                        accessToken: token,
                    })
                );
            } catch (error) {
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return children;
};

export default AuthInitializer;