import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(100, "Title must be at most 100 characters"),

  content: z.string().min(1, "Content must be at least 1 character"),

  tags: z.array(z.string()).optional(),

  removeImage: z.string().optional(),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
