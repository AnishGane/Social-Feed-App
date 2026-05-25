import { useState } from "react";
import UserAvatar from "../user-avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

type Props = {
    userId: string;
    onSubmit: (content: string) => Promise<void>;
};

const CommentInput = ({ userId, onSubmit }: Props) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const trimmed = content.trim();

        if (!trimmed) return;

        try {
            setIsSubmitting(true);

            await onSubmit(trimmed);

            setContent("");

            toast.success("Comment submitted successfully.");
        } catch {
            toast.error("Failed to submit comment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setContent("");
    }

    return (
        <div className="flex items-start gap-2 w-full">
            <UserAvatar seed={userId} className="size-10" />

            <div className="w-full flex flex-col items-end gap-2">
                <Textarea
                    placeholder="Add a comment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSubmitting}
                    className="min-h-0 resize-none"
                    rows={6}
                />
                {content.trim().length > 0 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            onClick={handleCancel}
                            aria-label="Cancel comment"
                            className="cursor-pointer rounded-full p-4"
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            aria-label="Send comment"
                            className="cursor-pointer rounded-full p-4"
                        >
                            Comment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentInput;