import { z } from "zod";

export const createPostInput = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(100, "Title must be at most 100 characters"),
  content: z.string().min(1, "Content must be at least 1 character"),

  thumbnailImage: z
    .string()
    .url("Thumbnail image must be a valid URL")
    .optional(),
  mainImage: z.string().url("Main image must be a valid URL").optional(),

  tags: z.array(z.string()).optional(),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(100, "Title must be at most 100 characters")
    .optional(),
  content: z.string().min(1, "Content must be at least 1 character").optional(),
  thumbnailImage: z
    .string()
    .url("Thumbnail image must be a valid URL")
    .optional(),
  mainImage: z.string().url("Main image must be a valid URL").optional(),
  tags: z.array(z.string()).optional(),
});
