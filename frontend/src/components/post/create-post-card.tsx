import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import CreatePostDialog from "./create-post-dialog";

const CreatePostCard = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Card className="mb-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        What's on your mind?
                    </p>

                    <Button onClick={() => setOpen(true)}>
                        Create Post
                    </Button>
                </div>
            </Card>

            <CreatePostDialog
                open={open}
                onOpenChange={setOpen}
            />
        </>
    )
}

export default CreatePostCard