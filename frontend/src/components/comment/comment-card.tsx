import type { Comment } from "@/types";
import UserAvatar from "../user-avatar";
import CommentActionsDropdown from "./comment-action-dropdown";
import { formatCommentDate } from "@/utils/format-date";
import { useEffect, useRef, useState } from "react";
import { useUpdateCommentMutation } from "@/services/comment-api";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Dot } from "lucide-react";

type Props = {
    comment: Comment;
    currentUserId?: string;
};

const CommentCard = ({ comment, currentUserId }: Props) => {
    const isOwner = currentUserId === comment.author._id;

    const [isEditable, setIsEditable] = useState(false);

    const [content, setContent] = useState(comment.content);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        setContent(comment.content);
    }, [comment.content])


    const [updateComment, { isLoading }] =
        useUpdateCommentMutation();

    // focus textarea when edit mode starts
    useEffect(() => {
        if (isEditable && textareaRef.current) {
            textareaRef.current.focus();

            // move cursor to end
            const length = textareaRef.current.value.length;

            textareaRef.current.setSelectionRange(length, length);
        }
    }, [isEditable]);

    const handleEnableEdit = () => {
        setIsEditable(true);
    };

    const handleCancelEdit = () => {
        setContent(comment.content);
        setIsEditable(false);
    };

    const handleSaveEdit = async () => {
        const trimmed = content.trim();

        if (!trimmed) return;

        // no changes
        if (trimmed === comment.content) {
            setIsEditable(false);
            return;
        }

        try {
            await updateComment({
                commentId: comment._id,
                content: trimmed,
                postId: comment.post,
            }).unwrap();

            setIsEditable(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex gap-3">
            <UserAvatar
                seed={comment.author._id}
                className="size-10"
            />

            <div className="flex-1 space-y-1">
                {/* header */}
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">
                        {comment.author.username}
                    </p>

                    <span className="text-xs text-muted-foreground">
                        {formatCommentDate(comment.createdAt)}
                    </span>

                    {comment.isEdited && (
                        <div className="flex items-center justify-center">
                            <Dot className="text-muted-foreground" />
                            <span className="text-muted-foreground text-[13px]">edited</span>
                        </div>
                    )}

                    {isOwner && (
                        <div className="ml-auto">
                            <CommentActionsDropdown
                                comment={comment}
                                onEdit={handleEnableEdit}
                            />
                        </div>
                    )}
                </div>

                {/* content */}
                {isEditable ? (
                    <div className="space-y-3">
                        <Textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                            disabled={isLoading}
                            rows={3}
                            className="min-h-0 resize-none border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0 bg-transparent!"
                        />

                        {/* youtube style buttons */}
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={handleCancelEdit}
                                disabled={isLoading}
                                className="rounded-full cursor-pointer"
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleSaveEdit}
                                disabled={
                                    isLoading ||
                                    !content.trim()
                                }
                                className="rounded-full cursor-pointer"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm whitespace-pre-wrap wrap-break-words">
                        {content}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CommentCard;