import { closeSearch, selectSearchOpen } from "@/features/search/search-slice";
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useSearchUsersQuery } from "@/services/user-api";
import type { SearchUser } from "@/types";
import { addRecentSearch, clearRecentSearches, getRecentSearches, removeRecentSearch } from "@/utils/recent-searches";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import UserAvatar from "../user-avatar";
import { X } from "lucide-react";
import { Button } from "../ui/button";

const SearchModal = () => {
    const open = useAppSelector(selectSearchOpen);
    const dispatch = useAppDispatch();

    const close = () => dispatch(closeSearch());

    const [query, setQuery] = useState('');
    const [debounced] = useDebounce(query, 400);
    const [recent, setRecent] = useState<SearchUser[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const navigate = useNavigate();

    const { data, isFetching } = useSearchUsersQuery(debounced, {
        skip: !debounced.trim(),
    });

    const users: SearchUser[] = data?.data || [];

    const list = debounced.trim() ? users : recent;

    useEffect(() => {
        if (open) {
            setRecent(getRecentSearches());
        }
    }, [open]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [debounced, open]);

    const handleSelect = (user: SearchUser) => {
        addRecentSearch(user);
        setRecent(getRecentSearches());
        navigate(`/u/${user.username}`);
        close();
        setQuery("");
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!list.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) =>
                Math.min(i + 1, list.length - 1),
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
        }

        if (e.key === "Enter") {
            e.preventDefault();
            handleSelect(list[selectedIndex]);
        }

        if (e.key === "Escape") {
            close();
        }
    };

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent showCloseButton={false} className="p-0 overflow-hidden max-w-xl animate-in">
                {/* SEARCH HEADER */}
                <div className="border-b p-3">
                    <Input
                        autoFocus
                        placeholder="Search users..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKeyDown}
                        className="h-11 rounded-md"
                    />
                </div>

                {/* RESULTS */}
                <div className="max-h-[400px] overflow-y-auto">
                    {debounced.trim() ? (
                        isFetching ? (
                            <div className="p-4 text-sm text-muted-foreground">
                                Searching...
                            </div>
                        ) : users.length ? (
                            users.map((user, idx) => (
                                <button
                                    key={user._id}
                                    onClick={() => handleSelect(user)}
                                    className={`flex w-full items-center gap-3 p-3 text-left transition ${idx === selectedIndex
                                        ? "bg-muted"
                                        : "hover:bg-muted/50"
                                        }`}
                                >
                                    <UserAvatar seed={user._id} className="h-10 w-10" />

                                    <div>
                                        <p className="font-medium">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            @{user.username}
                                        </p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-sm text-muted-foreground">
                                No results
                            </div>
                        )
                    ) : (
                        <div className="px-3 pb-3">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Recent searches
                                </p>

                                {recent.length > 0 && (
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            clearRecentSearches();
                                            setRecent([]);
                                        }}
                                        className="text-xs text-red-500 cursor-pointer"
                                    >
                                        Clear all
                                    </Button>
                                )}
                            </div>

                            {recent.map((user, idx) => (
                                <button
                                    key={user._id}
                                    onClick={() => handleSelect(user)}
                                    className={`flex w-full items-center justify-between gap-3 p-3 text-left transition ${idx === selectedIndex
                                        ? "bg-muted"
                                        : "hover:bg-muted/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <UserAvatar seed={user._id} className="h-10 w-10" />

                                        <div>
                                            <p>{user.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                @{user.username}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeRecentSearch(user._id);
                                            setRecent(getRecentSearches());
                                        }}
                                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                        <X className="size-4" />
                                        <span className="sr-only">Remove recent search</span>
                                    </Button>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SearchModal