import PostCard from "./post-card";
import PostSkeleton from "./post-skeleton";
import EmptyFeed from "./empty-feed";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import type { FeedType } from "@/types";

type Props = {
    userId?: string;
    type?: FeedType;
}

const PostFeed = ({ userId, type }: Props) => {
    const {
        posts,
        isFetching,
        initialLoading,
        loadMoreRef,
        updatePost,
        totalVotedPostCount: totalCount,
        totalBookmarkedPostCount
    } = useInfinitePosts({ userId, type });

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
        <>
            {type === "voted" ?
                <h2 className="text-base my-4 font-medium">Voted posts till now <span className="text-xl"> ({totalCount})</span></h2>
                : type === "bookmarked" ?
                    <h2 className="text-base my-4 font-medium">Bookmarked posts till now <span className="text-xl"> ({totalBookmarkedPostCount})</span></h2>
                    : ""}
            <div className="flex flex-col items-center gap-4">
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

            </div>
            <div ref={loadMoreRef} className="h-5" />
        </>
    );
};

export default PostFeed;

