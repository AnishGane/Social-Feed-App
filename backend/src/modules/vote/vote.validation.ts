import { z } from "zod";

export const voteSchema = z.object({
  postId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid postId"),
  type: z.enum(["up", "down"]),
});

export type VoteInput = z.infer<typeof voteSchema>;
