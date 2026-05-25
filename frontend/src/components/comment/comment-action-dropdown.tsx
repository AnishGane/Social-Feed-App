import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVertical, Loader2, Pencil, Trash2 } from "lucide-react";
import type { Comment } from "@/types/comment";
import { useDeleteCommentMutation } from "@/services/comment-api";
import { toast } from "sonner";

type Props = {
    comment: Comment;
    onEdit: () => void;
};

const CommentActionsDropdown = ({ comment, onEdit }: Props) => {
    const [deleteComment, { isLoading }] = useDeleteCommentMutation();

    const handleDelete = async () => {
        try {

            await deleteComment({
                commentId: comment._id,
                postId: comment.post,
            });

            toast.success("Comment deleted successfully.");
        }
        catch (error) {
            toast.error("Failed to delete comment.");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                >
                    <EllipsisVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                    <Pencil className="size-4" />
                    Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-destructive cursor-pointer focus:text-destructive"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Deleting
                        </>
                    ) : (
                        <>
                            <Trash2 className="size-4" />
                            Delete
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CommentActionsDropdown;