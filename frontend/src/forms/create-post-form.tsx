import { createPostSchema, type CreatePostInput } from "@/schema/post-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { useCreatePostMutation } from "@/services/post-api"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import { Image, X } from "lucide-react"

const CreatePostForm = ({ onOpenChange }: { onOpenChange: (open: boolean) => void }) => {
    const form = useForm<CreatePostInput>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: "",
            content: "",
            mainImage: undefined,
            tags: "",
        },
    })

    const [createPost, { isLoading }] = useCreatePostMutation();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const currentUrlRef = useRef<string | null>(null);

    useEffect(() => {
        // Revoke the previous URL when a new one is set
        if (currentUrlRef.current && currentUrlRef.current !== previewUrl) {
            URL.revokeObjectURL(currentUrlRef.current);
        }
        currentUrlRef.current = previewUrl;

        // Cleanup on unmount
        return () => {
            if (currentUrlRef.current) {
                URL.revokeObjectURL(currentUrlRef.current);
            }
        };
    }, [previewUrl]);

    const removeImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        form.setValue("mainImage", undefined);
    }

    async function onSubmit(data: CreatePostInput) {
        try {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append(
                "content",
                data.content
            );

            formData.append(
                "tags",
                JSON.stringify(data.tags.split(",").map((tag) => tag.trim()).filter(Boolean))
            )

            if (
                data.mainImage &&
                data.mainImage.length > 0
            ) {
                formData.append(
                    "mainImage",
                    data.mainImage[0]
                );
            }

            await createPost(
                formData
            ).unwrap();

            form.reset();
            toast.success("Post created successfully.");

            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post.");
        }
    }

    return (
        <form id="form-rhf-post" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-post-title" className="text-base">
                                Title
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-rhf-post-title"
                                aria-invalid={fieldState.invalid}
                                placeholder="Having a Good Day! yay 🫡"
                                autoComplete="off"
                                className="rounded-sm"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="content"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-post-content" className="text-base">
                                Content
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="form-rhf-post-content"
                                    placeholder="What's on your mind?"
                                    rows={6}
                                    className="min-h-24 resize-none rounded-sm"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field.value.length}/500 characters
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="mainImage"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-post-mainimage">
                                Media (optional)
                            </FieldLabel>

                            <div className="space-y-3">
                                {/* Upload Area */}
                                {!previewUrl && (
                                    <label
                                        htmlFor="form-rhf-post-mainimage"
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors hover:bg-muted/50"
                                    >
                                        <div className="space-y-2 flex flex-col items-center justify-center">
                                            <div className="size-14 rounded-full bg-muted-foreground/20 hover:border hover:border-primary/60 transition-all duration-200 hover:border-dashed flex items-center justify-center">
                                                <Image className="size-8 text-muted-foreground/90" />
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                PNG, JPG, WEBP up to 5MB
                                            </p>
                                        </div>

                                        <Input
                                            id="form-rhf-post-mainimage"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = e.target.files;

                                                field.onChange(files);

                                                if (files && files[0]) {
                                                    // Revoke previous URL to prevent memory leak
                                                    if (previewUrl) {
                                                        URL.revokeObjectURL(previewUrl);
                                                    }
                                                    const imageUrl = URL.createObjectURL(files[0]);

                                                    setPreviewUrl(imageUrl);
                                                } else {
                                                    if (previewUrl) {
                                                        URL.revokeObjectURL(previewUrl);
                                                    }
                                                    setPreviewUrl(null);
                                                }
                                            }}
                                        />
                                    </label>
                                )}

                                {previewUrl && (
                                    <div className="overflow-hidden rounded-xl border relative">
                                        <Button type="button" variant="destructive"
                                            className="size-8 rounded-full bg-destructive/80 hover:bg-destructive scale-95 hover:scale-100 transition-all duration-200 text-secondary cursor-pointer flex items-center justify-center right-2 top-2 absolute"
                                            onClick={removeImage}
                                            aria-label="Remove image">
                                            <X className="size-5" />
                                        </Button>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-h-80 w-full object-cover" />
                                    </div>
                                )}
                            </div>

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="tags"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-post-tags">
                                Tags
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-rhf-post-tags"
                                aria-invalid={fieldState.invalid}
                                placeholder="AI, ML, OpenAI"
                                autoComplete="off"
                            />
                            <FieldDescription className="text-xs tracking-wide">
                                Separate tags with commas
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <div className="flex w-full items-center gap-2">
                    <Button type="reset" disabled={isLoading} variant="secondary" onClick={() => {
                        if (previewUrl) {
                            URL.revokeObjectURL(previewUrl);
                        }
                        setPreviewUrl(null);
                        form.reset();
                    }}
                        className="cursor-pointer py-5 flex-1">
                        Reset
                    </Button>
                    <Button type="submit" disabled={isLoading} className="cursor-pointer py-5 flex-1">
                        {isLoading ? "Creating..." : "Create Post"}
                    </Button>
                </div>
            </FieldGroup>
        </form>

    )
}

export default CreatePostForm