import { z } from "zod";

export const bookmarkSchema = z.object({
  postId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid postId"),
});

export type BookmarkInput = z.infer<typeof bookmarkSchema>;
