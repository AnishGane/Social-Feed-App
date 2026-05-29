import type { SearchUser } from "@/types/user";

const KEY = "social_recent_searches";

export const getRecentSearches = (): SearchUser[] => {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = (user: SearchUser) => {
  const prev = getRecentSearches();

  const filtered = prev.filter((u) => u._id !== user._id);

  const updated = [user, ...filtered].slice(0, 10);

  localStorage.setItem(KEY, JSON.stringify(updated));
};

export const removeRecentSearch = (id: string) => {
  const prev = getRecentSearches();

  const updated = prev.filter((u) => u._id !== id);

  localStorage.setItem(KEY, JSON.stringify(updated));
};

export const clearRecentSearches = () => {
  localStorage.removeItem(KEY);
};
