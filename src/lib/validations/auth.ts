import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid university or personal email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must be under 80 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be 72 characters or fewer")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    role: z.enum(["alumni", "student"]),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  headline: z.string().max(160).optional(),
  about: z.string().max(2000).optional(),
  location: z.string().max(120).optional(),
  graduationYear: z
    .string()
    .optional()
    .refine(
      (value) => !value || (/^\d{4}$/.test(value) && Number(value) >= 1950 && Number(value) <= 2100),
      "Enter a year between 1950 and 2100"
    ),
  programme: z.string().max(160).optional(),
  department: z.string().max(160).optional(),
  faculty: z.string().max(160).optional(),
  industry: z.string().max(120).optional(),
  company: z.string().max(160).optional(),
  jobTitle: z.string().max(160).optional(),
  skills: z.array(z.string()).optional(),
  openToWork: z.boolean(),
  openToMentor: z.boolean(),
  avatar: z.any().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
