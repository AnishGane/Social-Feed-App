import { z } from "zod";

const optionalUrl = z
  .string()
  .url("URL must be a valid URL")
  .optional()
  .or(z.literal(""));

export const updateProfileSchema = z.object({
  name: z.string().max(50, "Name must be at most 50 characters").optional(),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),

  socialLinks: z
    .object({
      website: optionalUrl,
      github: optionalUrl,
      linkedin: optionalUrl,
      twitter: optionalUrl,
      instagram: optionalUrl,
      youtube: optionalUrl,
    })
    .optional(),
});

export const getUserProfileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be at most 50 characters"),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
