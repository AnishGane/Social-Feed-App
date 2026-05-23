import type { Post } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVertical, Trash2 } from "lucide-react";
import AlertDialogComp from "../alert-dialog-comp";
import ShareButton from "./share-button";
import EditPostSheet from "./sheets/edit-post-sheet";

type Props = {
    post: Post
}

const OwnerPostDropDown = ({ post }: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="cursor-pointer rounded-full px-2 ml-1"
                    aria-label="Post actions"
                >
                    <EllipsisVertical className="rotate-90" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-fit">
                <EditPostSheet post={post} />

                <DropdownMenuSeparator />

                <AlertDialogComp
                    icon={Trash2}
                    title="Are you sure you want to delete this post?"
                    description="This action cannot be undone. If you once deleted a post, you can't recover it."
                    iconLabel="Delete this Post"
                    post={post} />

                <DropdownMenuSeparator />

                <ShareButton postId={post._id} title={post.title} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default OwnerPostDropDown