import { useToggleBookmarkMutation } from "@/services/post-api";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import type { Post } from "@/types";
import { toast } from "sonner";

type Props = {
    post: Post
    onBookmarkUpdate: (
        postId: string,
        updates: Partial<Post>
    ) => void;
};

const BookmarkButton = ({
    post,
    onBookmarkUpdate,
}: Props) => {
    const [toggleBookmark, { isLoading }] =
        useToggleBookmarkMutation();

    const isBooked = post.isBookmarked;

    const handleBookmarkUpdate = async () => {
        try {
            const res = await toggleBookmark({
                postId: post._id,
            }).unwrap();

            onBookmarkUpdate(post._id, {
                isBookmarked: res.data.isBookmarked,
                bookmarksCount: res.data.bookmarksCount,
            });

            toast.success(isBooked ? "Bookmark removed" : "Bookmark added");
        } catch (error) {
            toast.error("Failed to toggle bookmark.");
        }
    };

    return (
        <div className="flex items-center pr-1">
            <Button
                variant="ghost"
                className="p-0 cursor-pointer"
                disabled={isLoading}
                aria-label={
                    isBooked
                        ? "Remove bookmark"
                        : "Add bookmark"
                }
                onClick={handleBookmarkUpdate}
            >
                <Bookmark
                    className={`size-5 ${isBooked
                        ? "fill-primary text-primary"
                        : ""
                        }`}
                />
            </Button>

            <span className="text-base">
                {post.bookmarksCount}
            </span>
        </div>
    );
};

export default BookmarkButton;