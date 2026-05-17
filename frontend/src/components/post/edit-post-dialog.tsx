import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Pencil } from "lucide-react";
import { Separator } from "../ui/separator";
import PostForm from "@/forms/post-form";
import type { Post } from "@/types";

type Props = {
    post: Post;
};

const EditPostDialog = ({
    post,
}: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    setOpen(true);
                }}
            >
                <Pencil />

                Edit Post
            </DropdownMenuItem>

            <Dialog
                open={open}
                onOpenChange={setOpen}
            >
                <DialogContent className="max-w-lg!">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            Edit Post
                        </DialogTitle>
                    </DialogHeader>

                    <Separator />

                    <PostForm
                        mode="edit"
                        post={post}
                        onOpenChange={setOpen}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditPostDialog;