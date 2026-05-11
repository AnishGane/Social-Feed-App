import { useEffect, useRef, useState } from "react";
import type { Post } from "@/types";
import { useGetPostsQuery } from "@/services/post-api";
import PostCard from "./post-card";
import PostSkeleton from "./post-skeleton";
import EmptyFeed from "./empty-feed";

const LIMIT = 10;

const PostFeed = () => {
    const [skip, setSkip] = useState(0);

    const [allPosts, setAllPosts] = useState<Post[]>([]);

    const [hasMore, setHasMore] = useState(true);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const { data, isLoading, isFetching } =
        useGetPostsQuery({
            skip,
            limit: LIMIT,
        });

    useEffect(() => {
        if (!data?.data) return;

        setAllPosts((prev) => {
            const existingIds = new Set(
                prev.map((post) => post._id)
            );

            const newPosts = data.data.filter(
                (post) => !existingIds.has(post._id)
            );

            return [...prev, ...newPosts];
        });

        if (data.data.length < LIMIT) {
            setHasMore(false);
        }
    }, [data]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];

                if (
                    first.isIntersecting &&
                    hasMore &&
                    !isFetching
                ) {
                    setSkip((prev) => prev + LIMIT);
                }
            },
            {
                threshold: 1,
            }
        );

        const currentRef = loadMoreRef.current;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasMore, isFetching]);

    const handleVoteUpdate = (
        postId: string,
        updates: Partial<Post>
    ) => {
        setAllPosts((prev) =>
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

    if (isLoading && allPosts.length === 0) {
        return (
            <div className="space-y-4">
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </div>
        );
    }

    if (!allPosts.length) {
        return <EmptyFeed />;
    }

    return (
        <div className="space-y-4">
            {allPosts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    onVoteUpdate={handleVoteUpdate}
                />
            ))}

            {isFetching && (
                <div className="space-y-4">
                    <PostSkeleton />
                </div>
            )}

            <div ref={loadMoreRef} />
        </div>
    );
};

export default PostFeed;