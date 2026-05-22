import { useCallback, useEffect, useState } from "react";
import {
  useLazyGetVotedPostByUserQuery,
  useLazyGetPostsBookmarkedByUserQuery,
} from "@/services/post-api";

type Counts = {
  voted: number;
  bookmarked: number;
};

const useProfileCounts = (userId?: string) => {
  const [counts, setCounts] = useState<Counts>({
    voted: 0,
    bookmarked: 0,
  });

  const [getVoted] = useLazyGetVotedPostByUserQuery();
  const [getBookmarked] = useLazyGetPostsBookmarkedByUserQuery();

  const fetchCounts = useCallback(async () => {
    if (!userId) return;

    const [votedRes, bookmarkedRes] = await Promise.all([
      getVoted({ limit: 1 }).unwrap(),
      getBookmarked({ limit: 1 }).unwrap(),
    ]);

    setCounts({
      voted: votedRes.data.totalCount ?? 0,
      bookmarked: bookmarkedRes.data.totalCount ?? 0,
    });
  }, [userId, getVoted, getBookmarked]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return {
    counts,
    refetchCounts: fetchCounts,
  };
};

export default useProfileCounts;
