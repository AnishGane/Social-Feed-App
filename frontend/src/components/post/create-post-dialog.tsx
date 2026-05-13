import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import CreatePostForm from "@/forms/create-post-form";
import { Separator } from "../ui/separator";

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
            <DialogContent className="w-full max-w-lg! mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Create a new Post
                    </DialogTitle>
                </DialogHeader>
                <Separator />

                <CreatePostForm onOpenChange={onOpenChange} />
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostDialog;