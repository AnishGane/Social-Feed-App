import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().max(50, "Name must be at most 50 characters").optional(),

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
