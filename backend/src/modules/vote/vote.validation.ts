import { z } from "zod";

export const voteSchema = z.object({
  postId: z.string(),
  type: z.enum(["up", "down"]),
});

export type VoteInput = z.infer<typeof voteSchema>;
