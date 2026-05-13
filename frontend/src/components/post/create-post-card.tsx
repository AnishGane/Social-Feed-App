import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import CreatePostDialog from "./create-post-dialog";
import { Lightbulb, Plus } from "lucide-react";

const CreatePostCard = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Card className="mb-6 p-2">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex text-muted-foreground items-center gap-1">
                        <Lightbulb className="size-4.5" />
                        <p className="text-sm ">
                            What's on your mind?
                        </p>
                    </div>

                    <Button className="py-5 cursor-pointer rounded-lg text-xs" size="sm" onClick={() => setOpen(true)}>
                        <Plus /> Create a Post
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