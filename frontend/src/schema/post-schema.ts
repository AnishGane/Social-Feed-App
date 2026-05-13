import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB = 5,242,880 bytes
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(100, "Title must be at most 100 characters"),
  content: z.string().min(1, "Content must be at least 1 character"),
  // thumbnailImage: z.string().url("Thumbnail image must be a valid URL").optional(),
  mainImage: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => {
        if (files.length === 0) {
          return true;
        }

        return files[0].size <= MAX_FILE_SIZE;
      },
      {
        message: "File size must be less than 5MB",
      },
    )
    .refine(
      (files) => {
        if (files.length === 0) {
          return true;
        }

        return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
      },
      {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported",
      },
    ),
  tags: z.string().optional().default(""),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
