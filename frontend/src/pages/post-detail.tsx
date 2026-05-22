import PostCard from "@/components/post/post-card";
import PostSkeleton from "@/components/post/post-skeleton";
import { Card } from "@/components/ui/card";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import { useGetPostByIdQuery } from "@/services/post-api";
import { CircleX } from "lucide-react";
import { useParams } from "react-router-dom";

const PostDetailPage = () => {
    const { postId } = useParams();
    const { updatePost } = useInfinitePosts();
    const { data, isLoading, isError, error } = useGetPostByIdQuery(postId ?? "", {
        skip: !postId
    })

    if (!postId) {
        return (
            <Card className="max-w-3xl mx-auto h-40 flex items-center justify-center text-muted-foreground mt-6">
                <p>Post ID is required</p>
            </Card>
        )
    }

    if (isLoading) return (
        <div className="max-w-3xl mx-auto mt-6">
            <PostSkeleton />
        </div>
    )
    if (isError) return (
        <div className="mx-auto w-full h-full flex items-center justify-center flex-col gap-2 max-w-3xl px-4 py-6">
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
            <div>
                <h1>PostDetailPage</h1>
                <p>Post not found</p>
            </div>
        );
    }

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-6">
            <PostCard post={post} onVoteUpdate={updatePost} />
        </main>
    )
}

export default PostDetailPage