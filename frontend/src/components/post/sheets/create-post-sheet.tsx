import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import PostForm from "@/forms/post-form";

const CreatePostSheet = () => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="py-5 px-2.5 cursor-pointer rounded-full text-xs" title="Create new post">
                    <Plus className="size-5" />
                    <span className="sr-only">Create new post</span>
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