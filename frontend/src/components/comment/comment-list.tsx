import type { Comment } from "@/types/comment";
import CommentCard from "./comment-card";

type Props = {
    comments: Comment[];
    currentUserId?: string;
};

const CommentList = ({ comments, currentUserId }: Props) => {
    if (!comments.length) {
        return (
            <div className="py-10 text-center text-muted-foreground">
                No comments yet
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {comments.map((comment) => (
                <CommentCard
                    key={comment._id}
                    comment={comment}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
};

export default CommentList;