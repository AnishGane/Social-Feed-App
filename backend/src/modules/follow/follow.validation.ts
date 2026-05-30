import { z } from "zod";

export const toggleFollowSchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i),
});
