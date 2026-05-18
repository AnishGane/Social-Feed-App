import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().max(50, "Name must be at most 50 characters").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .toLowerCase()
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    )
    .optional(),

  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),

  socialLinks: z
    .object({
      website: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
