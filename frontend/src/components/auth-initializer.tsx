import { logout, setCredentials } from '@/features/auth/auth-slice';
import { useAppDispatch } from '@/hooks';
import { useLazyMeQuery, useRefreshMutation } from '@/services/auth-api';
import React, { useEffect, useState } from 'react'

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();

    const [refresh] = useRefreshMutation();
    const [getMe] = useLazyMeQuery();

    useEffect(() => {
        const initAuth = async () => {
            try {
                // 1. refresh token (cookie-based)
                const res = await refresh().unwrap();
                const token = res.data.accessToken;

                // set token FIRST
                dispatch(setCredentials({ user: null, accessToken: token }));

                // THEN call /me
                const userRes = await getMe().unwrap();

                // 3. store both
                dispatch(
                    setCredentials({
                        user: userRes.data,
                        accessToken: token
                    })
                );
            } catch {
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        }

        initAuth();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return children;
}

export default AuthInitializer