import z from "zod";

export const bookmarkSchema = z.object({
  postId: z.string(),
});

export type BookmarkInput = z.infer<typeof bookmarkSchema>;
