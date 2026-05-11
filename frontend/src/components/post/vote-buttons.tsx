// components/post/vote-buttons.tsx

import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Post } from "@/types";

import { useVotePostMutation } from "@/services/post-api";

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
    const [votePost, { isLoading }] =
        useVotePostMutation();

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
            >
                <ArrowBigUp className="size-4" />
            </Button>

            <span className="min-w-8 text-center text-sm font-semibold">
                {post.score}
            </span>

            <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={() => handleVote("down")}
            >
                <ArrowBigDown className="size-4" />
            </Button>
        </div>
    );
};

export default VoteButtons;