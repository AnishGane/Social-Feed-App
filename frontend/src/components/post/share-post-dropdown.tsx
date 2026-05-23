// share-post-dropdown.tsx

import type { Post } from "@/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";
import ShareButton from "./share-button";

type Props = {
    post: Post;
}

const SharePostDropdown = ({
    post,
}: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="rounded-full px-2"
                >
                    <EllipsisVertical className="rotate-90" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-fit">
                <ShareButton
                    postId={post._id}
                    title={post.title}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SharePostDropdown;