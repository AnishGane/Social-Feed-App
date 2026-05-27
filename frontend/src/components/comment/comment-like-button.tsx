import { cn } from "@/lib/utils";
import { useToggleCommentLikeMutation } from "@/services/comment-api";
import type { Comment } from "@/types";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";

type Props = {
    comment: Pick<Comment, "likesCount" | "isLiked" | "_id">;
    postId: string;
};

const CommentLikeButton = ({
    comment: { likesCount, isLiked, _id },
    postId,
}: Props) => {
    const [toggleLike] = useToggleCommentLikeMutation();

    const handleLike = async () => {
        try {
            await toggleLike({
                commentId: _id,
                postId,
            }).unwrap();

            toast.success(isLiked ? "Like removed" : "Like added");
        } catch {
            toast.error("Failed to toggle like.");
        }
    };

    return (
        <div className="flex items-center gap-1">
            <ThumbsUp
                onClick={handleLike}
                className={cn(
                    "size-3.5 cursor-pointer transition-colors",
                    isLiked && "fill-foreground"
                )}
            />

            <span>{likesCount}</span>
        </div>
    );
};

export default CommentLikeButton;