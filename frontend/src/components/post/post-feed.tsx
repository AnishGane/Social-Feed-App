import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/types";
import { useLazyGetPostsQuery } from "@/services/post-api";
import PostCard from "./post-card";
import PostSkeleton from "./post-skeleton";
import EmptyFeed from "./empty-feed";

const LIMIT = 10;

const PostFeed = () => {
    const [posts, setPosts] = useState<Post[]>(
        []
    );

    const [nextCursor, setNextCursor] =
        useState<string | null>(null);

    /*
      HAS MORE POSTS
    */
    const [hasMore, setHasMore] =
        useState(true);

    const [initialLoading, setInitialLoading] =
        useState(true);

    /*
      INTERSECTION OBSERVER REF
    */
    const loadMoreRef =
        useRef<HTMLDivElement | null>(null);

    /*
      RTK QUERY LAZY HOOK
    */
    const [
        getPosts,
        { isFetching },
    ] = useLazyGetPostsQuery();

    const fetchPosts = useCallback(
        async (cursor?: string) => {
            try {
                const response =
                    await getPosts({
                        cursor,
                        limit: LIMIT,
                    }).unwrap();

                const incomingPosts =
                    response.data.posts;

                const incomingNextCursor =
                    response.data.nextCursor;

                /*
                  APPEND UNIQUE POSTS
                */
                setPosts((prev) => {
                    const existingIds =
                        new Set(
                            prev.map(
                                (post) =>
                                    post._id
                            )
                        );

                    const uniquePosts =
                        incomingPosts.filter(
                            (post) =>
                                !existingIds.has(
                                    post._id
                                )
                        );

                    return [
                        ...prev,
                        ...uniquePosts,
                    ];
                });

                setNextCursor(
                    incomingNextCursor
                );

                /*
                  NO MORE POSTS
                */
                if (
                    !incomingNextCursor ||
                    incomingPosts.length <
                    LIMIT
                ) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch posts",
                    error
                );
            } finally {
                setInitialLoading(false);
            }
        },
        [getPosts]
    );

    /*
      INITIAL FETCH
    */
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    /*
      INTERSECTION OBSERVER
    */
    useEffect(() => {
        const observer =
            new IntersectionObserver(
                (entries) => {
                    const first =
                        entries[0];

                    if (
                        first.isIntersecting &&
                        hasMore &&
                        !isFetching &&
                        nextCursor
                    ) {
                        fetchPosts(
                            nextCursor
                        );
                    }
                },
                {
                    threshold: 1,
                }
            );

        const currentRef =
            loadMoreRef.current;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(
                    currentRef
                );
            }
        };
    }, [
        fetchPosts,
        hasMore,
        isFetching,
        nextCursor,
    ]);

    const handleVoteUpdate = (
        postId: string,
        updates: Partial<Post>
    ) => {
        setPosts((prev) =>
            prev.map((post) =>
                post._id === postId
                    ? {
                        ...post,
                        ...updates,
                    }
                    : post
            )
        );
    };

    if (
        initialLoading &&
        posts.length === 0
    ) {
        return (
            <div className="space-y-4">
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </div>
        );
    }

    if (!posts.length) {
        return <EmptyFeed />;
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    onVoteUpdate={
                        handleVoteUpdate
                    }
                />
            ))}

            {isFetching && (
                <div className="space-y-4">
                    <PostSkeleton />
                </div>
            )}

            <div
                ref={loadMoreRef}
                className="h-10"
            />
        </div>
    );
};

export default PostFeed;