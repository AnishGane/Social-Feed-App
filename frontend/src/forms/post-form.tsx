import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
    Image,
    Loader2,
    X,
} from "lucide-react";
import { toast } from "sonner";
import {
    createPostSchema,
    type CreatePostInput,
} from "@/schema/post-schema";
import {
    useCreatePostMutation,
    useUpdatePostMutation,
} from "@/services/post-api";
import type { Post } from "@/types";

type Props = {
    mode: "create" | "edit";
    post?: Post;
    onOpenChange: (open: boolean) => void;
};

const PostForm = ({
    mode,
    post,
    onOpenChange,
}: Props) => {
    const isEdit = mode === "edit";

    const form = useForm<CreatePostInput>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: post?.title || "",
            content: post?.content || "",
            mainImage: undefined,
            tags: post?.tags?.join(", ") || "",
        },
    });

    const [createPost, { isLoading: isCreating }] =
        useCreatePostMutation();

    const [updatePost, { isLoading: isUpdating }] =
        useUpdatePostMutation();

    const isLoading = isCreating || isUpdating;

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        post?.mainImage || null
    );

    // removal flag, send over to the backend to tell that ""user removed image""
    const [removeCurrentImage, setRemoveCurrentImage] =
        useState(false);

    const currentUrlRef = useRef<string | null>(null);

    useEffect(() => {
        if (
            currentUrlRef.current &&
            currentUrlRef.current !== previewUrl &&
            currentUrlRef.current.startsWith("blob:")
        ) {
            URL.revokeObjectURL(currentUrlRef.current);
        }

        currentUrlRef.current = previewUrl;

        return () => {
            if (
                currentUrlRef.current &&
                currentUrlRef.current.startsWith("blob:")
            ) {
                URL.revokeObjectURL(currentUrlRef.current);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        if (post) {
            form.reset({
                title: post.title,
                content: post.content,
                tags: post.tags?.join(", ") || "",
                mainImage: undefined,
            });

            setPreviewUrl(post.mainImage || null);
        }
    }, [post, form]);

    const removeImage = () => {
        if (previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(null);
        form.setValue("mainImage", undefined);

        setRemoveCurrentImage(true);
    };

    async function onSubmit(data: CreatePostInput) {
        try {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("content", data.content);

            formData.append(
                "tags",
                JSON.stringify(
                    data.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                )
            );

            formData.append("removeImage", String(removeCurrentImage));

            if (
                data.mainImage &&
                data.mainImage.length > 0
            ) {
                formData.append(
                    "mainImage",
                    data.mainImage[0]
                );
            }

            if (isEdit && post) {
                const res = await updatePost({
                    id: post._id,
                    data: formData,
                }).unwrap();


                toast.success(res.message);
            } else {
                await createPost(formData).unwrap();

                toast.success("Post created successfully.");
            }

            form.reset();

            setRemoveCurrentImage(false);

            onOpenChange(false);
        } catch (error) {
            console.error(error);

            toast.error(
                isEdit
                    ? "Failed to update post."
                    : "Failed to create post."
            );
        }
    }

    return (
        <form
            id="post-form"
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <FieldGroup>
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-base">
                                Title
                            </FieldLabel>

                            <Input
                                {...field}
                                placeholder="Having a Good Day! yay 🫡"
                                autoComplete="off"
                            />

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="content"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-base">
                                Content
                            </FieldLabel>

                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    rows={6}
                                    placeholder="What's on your mind?"
                                    className="min-h-24 resize-none"
                                />

                                <InputGroupAddon align="block-end">
                                    <InputGroupText>
                                        {field.value.length}/1000
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="mainImage"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>
                                Media (optional)
                            </FieldLabel>

                            <div className="space-y-3">
                                {!previewUrl && (
                                    <label
                                        htmlFor="post-image"
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors hover:bg-muted/50"
                                    >
                                        <div className="space-y-2 flex flex-col items-center">
                                            <div className="size-14 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                                                <Image className="size-8 text-muted-foreground/90" />
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                PNG, JPG,
                                                WEBP up to
                                                5MB
                                            </p>
                                        </div>

                                        <Input
                                            id="post-image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = e.target.files;

                                                field.onChange(files);

                                                if (files && files[0]) {
                                                    setRemoveCurrentImage(false);

                                                    const url = URL.createObjectURL(files[0]);

                                                    setPreviewUrl(url);
                                                }
                                            }}
                                        />
                                    </label>
                                )}

                                {previewUrl && (
                                    <div className="relative overflow-hidden rounded-xl border">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="absolute right-2 top-2 size-8 rounded-full"
                                            onClick={
                                                removeImage
                                            }
                                            aria-label="Remove selected image"
                                        >
                                            <X className="size-4" />
                                        </Button>

                                        <img
                                            src={
                                                previewUrl
                                            }
                                            alt="Preview"
                                            className="max-h-80 w-full object-cover"
                                        />
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
                            <FieldLabel>
                                Tags
                            </FieldLabel>

                            <Input
                                {...field}
                                placeholder="AI, ML, OpenAI"
                            />

                            <FieldDescription>
                                Separate tags with commas
                            </FieldDescription>

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                />
                            )}
                        </Field>
                    )}
                />

                <div className="flex gap-2">
                    <Button
                        type="reset"
                        variant="secondary"
                        className="flex-1"
                        disabled={isLoading}
                        onClick={() => {
                            form.reset();

                            setPreviewUrl(
                                post?.mainImage || null
                            );

                            setRemoveCurrentImage(false);
                        }}
                    >
                        Reset
                    </Button>

                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 animate-spin" />

                                {isEdit
                                    ? "Updating..."
                                    : "Creating..."}
                            </>
                        ) : isEdit ? (
                            "Update Post"
                        ) : (
                            "Create Post"
                        )}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
};

export default PostForm;