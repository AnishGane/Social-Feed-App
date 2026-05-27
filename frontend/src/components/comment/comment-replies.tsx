import { useEffect, useState } from "react";
import { useLazyGetRepliesByCommentQuery } from "@/services/comment-api";
import type { Comment } from "@/types/comment";
import { Button } from "../ui/button";
import CommentCard from "./comment-card";

type Props = {
    commentId: string;
    currentUserId?: string;
};

const CommentReplies = ({
    commentId,
    currentUserId,
}: Props) => {
    const [fetchReplies, { isLoading, isFetching, isError }] =
        useLazyGetRepliesByCommentQuery();

    const [replies, setReplies] = useState<Comment[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const loadInitial = async () => {
            try {
                const response = await fetchReplies({ commentId }).unwrap();
                setReplies(response.data.comments);
                setNextCursor(response.data.nextCursor);
                setHasMore(response.data.hasMore);
            } catch {
                setReplies([]);
                setNextCursor(null);
                setHasMore(false);
            }
        };

        loadInitial();
    }, [commentId, fetchReplies]);

    const loadMore = async () => {
        if (!hasMore || !nextCursor) return;

        try {
            const response = await fetchReplies({
                commentId,
                cursor: nextCursor,
            }).unwrap();

            setReplies((prev) => [...prev, ...response.data.comments]);
            setNextCursor(response.data.nextCursor);
            setHasMore(response.data.hasMore);
        } catch {
            // keep existing replies on pagination failure
        }
    };

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

    return (
        <div className="ml-6 mt-2 space-y-4 border-l pl-4">
            {replies.map((reply) => (
                <CommentCard
                    key={reply._id}
                    comment={reply}
                    currentUserId={currentUserId}
                />
            ))}

            {hasMore && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMore}
                    disabled={isFetching}
                >
                    Load more replies
                </Button>
            )}
        </div>
    );
};

export default CommentReplies;
