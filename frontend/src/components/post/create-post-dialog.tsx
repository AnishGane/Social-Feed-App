import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import PostForm from "@/forms/post-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const CreatePostDialog = ({
    open,
    onOpenChange,
}: Props) => {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Create a new Post
                    </DialogTitle>
                </DialogHeader>

                <Separator />

                <PostForm
                    mode="create"
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostDialog;