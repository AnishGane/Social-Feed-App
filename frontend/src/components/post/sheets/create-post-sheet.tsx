import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../../ui/button";
import PostForm from "@/forms/post-form";

const CreatePostSheet = () => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="p-5 rounded-3xl text-sm cursor-pointer" title="Create new post">
                    <p>Post</p>
                </Button>

            </SheetTrigger>
            <SheetContent className="px-4">
                <SheetHeader className="px-0">
                    <SheetTitle className="text-2xl">Create a post</SheetTitle>
                </SheetHeader>
                {/* Create Post Form */}
                <PostForm mode="create" onOpenChange={setOpen} />
            </SheetContent>
        </Sheet>
    )
}

export default CreatePostSheet