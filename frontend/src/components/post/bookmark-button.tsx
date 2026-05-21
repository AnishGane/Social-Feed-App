import { useToggleBookmarkMutation } from "@/services/post-api";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";

type Props = {
    postId: string,
    isBookmarked: boolean
    bookmarksCount: number
}

const BookmarkButton = ({ postId, isBookmarked, bookmarksCount }: Props) => {
    const [toggleBookmark, { isLoading }] = useToggleBookmarkMutation();

    return (
        <div className="flex items-center pr-1">
            <Button
                variant="ghost"
                className="p-0 cursor-pointer"
                disabled={isLoading}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                onClick={() => toggleBookmark({ postId })}
            >
                {isBookmarked ? <Bookmark className="size-5 fill-amber-50" /> : <Bookmark className="size-5" />}
            </Button>
            <span className="text-base">{bookmarksCount}</span>
        </div>
    );
};
export default BookmarkButton