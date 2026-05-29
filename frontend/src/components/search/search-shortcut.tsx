import { openSearch } from "@/features/search/search-slice";
import { useAppDispatch } from "@/hooks";
import { useEffect } from "react";

export const SearchShortcut = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                dispatch(openSearch());
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [dispatch]);

    return null;
};