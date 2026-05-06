import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address format")
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
});

export const signupSchema = loginSchema
  .extend({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type SignupSchemaType = z.infer<typeof signupSchema>;
