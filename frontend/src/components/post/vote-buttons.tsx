import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types";
import { useVotePostMutation } from "@/services/post-api";
import { cn } from "@/lib/utils";

type Props = {
    post: Post;

    onVoteUpdate: (
        postId: string,
        updates: Partial<Post>
    ) => void;
};

const VoteButtons = ({
    post,
    onVoteUpdate,
}: Props) => {
    const [votePost, { isLoading }] = useVotePostMutation();

    const isUpvoted = post.currentUserVote === "up";
    const isDownvoted = post.currentUserVote === "down";

    const handleVote = async (
        type: "up" | "down"
    ) => {
        try {
            const res = await votePost({
                postId: post._id,
                type,
            }).unwrap();

            onVoteUpdate(post._id, {
                upvotesCount: res.data.upvotesCount,
                downvotesCount:
                    res.data.downvotesCount,
                score: res.data.score,
                currentUserVote: res.data.currentUserVote,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={() => handleVote("up")}

                className="flex items-center gap-1 cursor-pointer"
            >
                <ThumbsUp className={cn("size-4", isUpvoted && "fill-primary")} />
                <p className="text-sm pt-px">{post.upvotesCount}</p>
            </Button>

            <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={() => handleVote("down")}
                className="flex items-center gap-1 cursor-pointer"
            >
                <ThumbsDown className={cn("size-4", isDownvoted && "fill-primary")} />
                <p className="text-sm pt-px">{post.downvotesCount}</p>
            </Button>
        </div >
    );
};

export default VoteButtons;