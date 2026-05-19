import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import CreatePostForm from "@/forms/create-post-form";

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
                            <CreatePostForm onOpenChange={setOpen} />
                        </SheetContent>
                    </Sheet>
                </div>
            </Card>
        </>
    )
}

export default CreatePostCard