import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import type { Post } from "@/types"
import { DropdownMenuItem } from "../../ui/dropdown-menu"
import { Pencil } from "lucide-react"
import { useState } from "react"
import PostForm from "@/forms/post-form"

type Props = {
    post: Post
}

const EditPostSheet = ({ post }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        setOpen(true);
                    }}
                >
                    <Pencil />
                    Edit this Post
                </DropdownMenuItem>
            </SheetTrigger>
            <SheetContent className="px-4">
                <SheetHeader className="px-0">
                    <SheetTitle className="text-2xl">Edit Post</SheetTitle>
                    {/* Edit Post Form */}
                    <PostForm
                        mode="edit"
                        post={post}
                        onOpenChange={setOpen}
                    />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default EditPostSheet