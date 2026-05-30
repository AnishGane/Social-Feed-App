import PostDetailCard from "@/components/post-detail/post-detail-card";
import PostDetailSidebar from "@/components/post-detail/post-detail-sidebar";
import RelatedPosts from "@/components/post-detail/related-posts";
import { Card } from "@/components/ui/card";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import { useGetPostByIdQuery } from "@/services/post-api";
import { ArrowLeft, CircleX } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PostDetailsSkeleton from "@/components/post-detail/post-details-skeleton";
import { usePostComments } from "@/hooks/use-post-comments";
import CommentInput from "@/components/comment/comment-input";
import CommentList from "@/components/comment/comment-list";
import { useAppSelector } from "@/hooks";
import PostDetailCommentSkeleton from "@/components/post-detail/post-detail-comment-skeleton";

const PostDetailPage = () => {
    const { postId } = useParams();
    const { updatePost } = useInfinitePosts();
    const { data, isLoading, isError, error } = useGetPostByIdQuery(postId ?? "", {
        skip: !postId
    })

    const user = useAppSelector((state) => state.auth.user);

    const {
        comments,
        createComment,
        isLoading: commentsLoading,
        totalComments
    } = usePostComments(postId);

    if (!postId) {
        return (
            <Card className="max-w-3xl mx-auto h-40 flex items-center justify-center text-muted-foreground mt-6">
                <p>Post ID is required</p>
            </Card>
        )
    }

    if (isLoading) return (
        <PostDetailsSkeleton />
    )
    if (isError) return (
        <div className="mx-auto w-full h-full flex items-center justify-center flex-col gap-2 max-w-4xl px-4 py-6">
            <CircleX className="size-16 text-destructive/80" />
            <div>
                <h1 className="text-2xl font-semibold text-center">Error loading post</h1>
                <p className="text-muted-foreground">
                    {error && 'status' in error && error.status === 404
                        ? 'Post not found'
                        : 'Failed to load post. Please try again.'}
                </p>
            </div>
        </div>
    );

    const post = data?.data;

    if (!post) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground">
                    Post not found
                </p>
            </div>
        );
    }
    return (
        <main className="mx-auto max-w-7xl px-4 py-6">
            {/* Back Button */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="size-4" />
                Back to feed
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                {/* Main Content */}
                <div className="space-y-6 min-w-0">
                    <PostDetailCard
                        post={post}
                        onVoteUpdate={updatePost}
                    />

                    {/* Comments */}
                    <Card className="p-6">
                        <div className="mb-2">
                            <h2 className="text-2xl font-semibold">
                                Discussion
                            </h2>

                            <p className="text-sm text-muted-foreground mt-1">
                                {totalComments} comments
                            </p>
                        </div>

                        {user && (
                            <div className="mb-2">
                                <CommentInput
                                    userId={user._id}
                                    onSubmit={createComment}
                                />
                            </div>
                        )}

                        {commentsLoading ? (
                            <PostDetailCommentSkeleton />
                        ) : (
                            <div className="ml-6">
                                <CommentList
                                    comments={comments}
                                    currentUserId={user?._id}
                                />
                            </div>
                        )}
                    </Card>

                    <RelatedPosts post={post} />
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block">
                    <PostDetailSidebar post={post} />
                </div>
            </div>
        </main>
    )
}

export default PostDetailPage