import { useCallback, useEffect, useRef, useState } from "react";
import type { FeedType, Post } from "@/types";
import {
  useLazyGetPostsQuery,
  useLazyGetPostsByUserQuery,
  useLazyGetVotedPostByUserQuery,
  type GetPostsResponse,
  useLazyGetPostsBookmarkedByUserQuery,
} from "@/services/post-api";

type UseInfinitePostsProps = {
  type?: FeedType;
  userId?: string;
};

const LIMIT = 10;

export const useInfinitePosts = ({
  type = "all",
  userId,
}: UseInfinitePostsProps = {}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [totalVotedPostCount, setTotalVotedPostCount] = useState(0);
  const [totalBookmarkedPostCount, setTotalBookmarkedPostCount] = useState(0);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [getPosts, { isFetching: isHomeFetching }] = useLazyGetPostsQuery();

  const [getUserPosts, { isFetching: isUserFetching }] =
    useLazyGetPostsByUserQuery();

  const [getVotedPosts, { isFetching: isVotedFetching }] =
    useLazyGetVotedPostByUserQuery();

  const [getBookmarkedPosts, { isFetching: isBookmarkedFetching }] =
    useLazyGetPostsBookmarkedByUserQuery();

  const isFetching =
    isHomeFetching || isUserFetching || isVotedFetching || isBookmarkedFetching;

  /**
   * CORE FETCH LOGIC
   */
  const fetchPosts = useCallback(
    async (nextCursor?: string) => {
      try {
        let response: GetPostsResponse;

        switch (type) {
          case "user":
            if (!userId) {
              console.error('userId is required when type is "user"');
              return;
            }
            response = await getUserPosts({
              userId,
              cursor: nextCursor ?? undefined,
              limit: LIMIT,
            }).unwrap();
            break;

          case "voted":
            response = await getVotedPosts({
              cursor: nextCursor ?? undefined,
              limit: LIMIT,
            }).unwrap();
            break;

          case "bookmarked":
            response = await getBookmarkedPosts({
              cursor: nextCursor ?? undefined,
              limit: LIMIT,
            }).unwrap();
            break;

          default:
            response = await getPosts({
              cursor: nextCursor ?? undefined,
              limit: LIMIT,
            }).unwrap();
        }

        const incomingPosts = response.data.posts;
        const incomingCursor = response.data.nextCursor;
        if (type === "voted") {
          setTotalVotedPostCount(response.data.totalCount ?? 0);
        }
        if (type === "bookmarked") {
          setTotalBookmarkedPostCount(response.data.totalCount ?? 0);
        }

        setPosts((prev) => {
          const existing = new Set(prev.map((p) => p._id));

          const unique = incomingPosts.filter((p) => !existing.has(p._id));

          return [...prev, ...unique];
        });

        setCursor(incomingCursor ?? null);

        setHasMore(!!incomingCursor);
      } finally {
        setInitialLoading(false);
      }
    },
    [type, userId, getPosts, getUserPosts, getVotedPosts, getBookmarkedPosts],
  );

  /**
   * RESET WHEN FEED CHANGES
   */
  useEffect(() => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    setInitialLoading(true);

    if (type !== "voted") {
      setTotalVotedPostCount(0);
    }

    if (type !== "bookmarked") {
      setTotalBookmarkedPostCount(0);
    }

    fetchPosts();
  }, [type, userId, fetchPosts]);

  /**
   * OBSERVER FOR INFINITE SCROLL
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && hasMore && !isFetching && cursor) {
          fetchPosts(cursor);
        }
      },
      {
        threshold: 1,
      },
    );

    const el = loadMoreRef.current;

    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [cursor, hasMore, isFetching, fetchPosts]);

  /**
   * UPDATE SINGLE POST
   */
  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, ...updates } : post,
      ),
    );
  }, []);

  /**
   * MANUAL REFRESH
   */
  const refresh = useCallback(() => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    setInitialLoading(true);

    setTotalVotedPostCount(0);
    setTotalBookmarkedPostCount(0);

    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    hasMore,
    cursor,
    isFetching,
    initialLoading,
    loadMoreRef,
    totalVotedPostCount,
    totalBookmarkedPostCount,

    fetchNext: () => {
      if (cursor) {
        fetchPosts(cursor);
      }
    },

    updatePost,
    refresh,
  };
};
