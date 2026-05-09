import { z } from "zod";

export const voteSchema = z.object({
  type: z.enum(["up", "down"]),
});

export type VoteInput = z.infer<typeof voteSchema>;
