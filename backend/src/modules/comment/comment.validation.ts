import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content must be at least 1 character")
    .max(500, "Content must be at most 500 characters"),
  postId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid postId"),
  parentComment: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid parentComment id")
    .optional(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content must be at least 1 character")
    .max(500, "Content must be at most 500 characters"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
