import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useCreatePostMutation } from "@/services/post-api";

type Props = {
    open: boolean,
    onOpenChange: (open: boolean) => void;
}

const CreatePostDialog = ({ open,
    onOpenChange }: Props) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mainImage, setMainImage] = useState("");
    const [tags, setTags] = useState("");

    const [createPost, { isLoading }] =
        useCreatePostMutation();

    const handleSubmit = async () => {
        try {
            await createPost({
                title,
                content,
                mainImage,
                tags: tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            }).unwrap();

            setTitle("");
            setContent("");
            setMainImage("");
            setTags("");

            onOpenChange(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <Textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                    />

                    <Input
                        placeholder="Image URL"
                        value={mainImage}
                        onChange={(e) =>
                            setMainImage(e.target.value)
                        }
                    />

                    <Input
                        placeholder="tags, separated, by commas"
                        value={tags}
                        onChange={(e) =>
                            setTags(e.target.value)
                        }
                    />

                    <Button
                        className="w-full"
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        Create Post
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePostDialog;