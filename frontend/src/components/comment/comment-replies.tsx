import { useGetRepliesByCommentQuery } from "@/services/comment-api";
import CommentCard from "./comment-card";

type Props = {
    commentId: string;
    currentUserId?: string;
};

const CommentReplies = ({
    commentId,
    currentUserId,
}: Props) => {
    const { data, isLoading, isError } =
        useGetRepliesByCommentQuery({
            commentId,
        });

    if (isLoading) {
        return (
            <p className="text-sm text-muted-foreground">
                Loading replies...
            </p>
        );
    }

    if (isError) {
        return (
            <p className="text-sm text-destructive">
                Failed to load replies.
            </p>
        );
    }

    const replies = data?.data.comments || [];

    return (
        <div className="ml-6 mt-2 space-y-4 border-l pl-4">
            {replies.map((reply) => (
                <CommentCard
                    key={reply._id}
                    comment={reply}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
};

export default CommentReplies;