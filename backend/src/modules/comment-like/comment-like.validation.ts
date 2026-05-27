import { z } from "zod";

export const toggleCommentLikeSchema = z.object({
  commentId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid commentId"),
});
