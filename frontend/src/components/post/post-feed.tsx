import PostCard from "./post-card";
import PostSkeleton from "./post-skeleton";
import EmptyFeed from "./empty-feed";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";

const PostFeed = ({ userId }: { userId?: string }) => {
    const {
        posts,
        isFetching,
        initialLoading,
        loadMoreRef,
        updatePost,
    } = useInfinitePosts({ userId });

    if (initialLoading && posts.length === 0) {
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
                    onVoteUpdate={updatePost}
                />
            ))}

            {isFetching && (
                <div className="space-y-4">
                    <PostSkeleton />
                </div>
            )}

            <div ref={loadMoreRef} className="h-10" />
        </div>
    );
};

export default PostFeed;