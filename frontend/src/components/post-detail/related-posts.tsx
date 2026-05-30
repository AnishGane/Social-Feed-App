import type { Post } from "@/types";
import { Card } from "../ui/card";
import { useGetRelatedPostsQuery } from "@/services/post-api";
import { Loader2 } from "lucide-react";
import RelatedPostsCard from "./related-posts-card";

type Props = {
    post: Post;
};

const RelatedPosts = ({ post }: Props) => {

    const { data, isLoading, isError } = useGetRelatedPostsQuery(post._id);

    const relatedPosts = data?.data ?? [];

    return (
        <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Related Posts by @{post.author.username}</h2>

            <div className="space-y-3">
                {isLoading && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2 justify-center py-6">
                        <Loader2 className="animate-spin size-5" />
                        Please wait..
                    </div>
                )}

                {!isLoading && isError && (
                    <div className="text-sm text-muted-foreground text-center py-8">
                        Failed to load related posts
                    </div>
                )}

                {!isLoading && !isError && relatedPosts.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-8">
                        No related posts found
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedPosts.map((p) => (
                        <RelatedPostsCard p={p} key={p._id} />
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default RelatedPosts;