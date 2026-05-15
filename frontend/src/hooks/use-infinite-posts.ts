import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/types";
import {
  useLazyGetPostsQuery,
  useLazyGetPostsByUserQuery,
} from "@/services/post-api";

type UseInfinitePostsProps = {
  userId?: string;
};

const LIMIT = 10;

export const useInfinitePosts = ({ userId }: UseInfinitePostsProps = {}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [getPosts, { isFetching: isHomeFetching }] = useLazyGetPostsQuery();

  const [getUserPosts, { isFetching: isUserFetching }] =
    useLazyGetPostsByUserQuery();

  const isFetching = isHomeFetching || isUserFetching;

  /**
   * CORE FETCH LOGIC
   */
  const fetchPosts = useCallback(
    async (nextCursor?: string) => {
      try {
        const response = userId
          ? await getUserPosts({
              userId,
              cursor: nextCursor ?? undefined,
              limit: LIMIT,
            }).unwrap()
          : await getPosts({
              cursor: nextCursor ?? undefined,
              limit: LIMIT,
            }).unwrap();

        const incomingPosts = response.data.posts;
        const incomingCursor = response.data.nextCursor;

        setPosts((prev) => {
          const existing = new Set(prev.map((p) => p._id));

          const unique = incomingPosts.filter((p) => !existing.has(p._id));

          return [...prev, ...unique];
        });

        setCursor(incomingCursor ?? null);

        if (!incomingCursor || incomingPosts.length < LIMIT) {
          setHasMore(false);
        }
      } finally {
        setInitialLoading(false);
      }
    },
    [userId, getPosts, getUserPosts],
  );

  /**
   * RESET WHEN USER CHANGES
   */
  useEffect(() => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    setInitialLoading(true);

    fetchPosts();
  }, [userId, fetchPosts]);

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
      { threshold: 1 },
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [cursor, hasMore, isFetching, fetchPosts]);

  /**
   * EXTERNAL HANDLER (for vote updates, edits, etc.)
   */
  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, ...updates } : post,
      ),
    );
  }, []);

  /**
   * MANUAL REFRESH (optional)
   */
  const refresh = useCallback(() => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    setInitialLoading(true);
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    hasMore,
    cursor,
    isFetching,
    initialLoading,
    loadMoreRef,
    fetchNext: () => cursor && fetchPosts(cursor),
    updatePost,
    refresh,
  };
};
