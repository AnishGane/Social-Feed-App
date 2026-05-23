import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import CreatePostSheet from "./sheets/create-post-sheet";

const CreatePostCard = () => {
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

                    <CreatePostSheet />
                </div>
            </Card>
        </>
    )
}

export default CreatePostCard