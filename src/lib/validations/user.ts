import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["student", "instructor", "admin"]),
});

export type UserFormValues = z.infer<typeof userSchema>;
