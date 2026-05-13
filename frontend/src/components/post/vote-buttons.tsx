// components/post/vote-buttons.tsx

import { ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Post } from "@/types";

import { useVotePostMutation } from "@/services/post-api";
import { useState } from "react";
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

    const [activeVote, setActiveVote] = useState<Record<string, boolean>>({
        up: false,
        down: false,
    });

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

    const handleVoteClick = async (type: "up" | "down") => {
        const isUp = type === "up";
        const wasActive = isUp ? activeVote.up : activeVote.down;
        const willBeActive = !wasActive;

        setActiveVote({
            up: isUp && willBeActive,
            down: !isUp && willBeActive,
        });

        try {
            await handleVote(type);
        } catch {
            // Revert on failure
            setActiveVote((prev) => ({
                ...prev,
                [type]: wasActive,
            }));
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={() => handleVoteClick("up")}

                className="flex items-center gap-1 cursor-pointer"
            >
                <ThumbsUp className={cn("size-4", activeVote.up && "fill-primary")} />
                <p className="text-sm pt-px">{post.upvotesCount}</p>
            </Button>

            <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={() => handleVoteClick("down")}
                className="flex items-center gap-1 cursor-pointer"
            >
                <ThumbsDown className={cn("size-4", activeVote.down && "fill-primary")} />
                <p className="text-sm pt-px">{post.downvotesCount}</p>
            </Button>
        </div >
    );
};

export default VoteButtons;