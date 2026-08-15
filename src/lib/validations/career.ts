import { z } from "zod";

export const jobFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["any", "full_time", "part_time", "internship", "contract"]),
  location: z.string().optional(),
  industry: z.string().optional(),
  sort: z.enum(["RECENT", "TITLE_ASC"]),
});

export const jobSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(140),
  company: z.string().trim().min(2, "Company is required").max(120),
  location: z.string().trim().min(2, "Location is required").max(120),
  type: z.enum(["full_time", "part_time", "internship", "contract"]),
  industry: z.string().max(80).optional(),
  description: z
    .string()
    .trim()
    .min(20, "Describe the role in at least 20 characters")
    .max(5000),
  requirements: z.string().max(3000).optional(),
  applicationUrl: z
    .string()
    .optional()
    .refine((value) => !value || /^https?:\/\//.test(value), "Enter a valid http(s) URL"),
});

export const applySchema = z.object({
  coverNote: z.string().trim().min(20, "Write at least 20 characters").max(2000),
  resume: z.any().optional(),
});

export const mentorFilterSchema = z.object({
  search: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
});

export const mentorshipRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(20, "Explain what you need in at least 20 characters")
    .max(1000),
});

export const mentorshipGoalSchema = z.object({
  text: z.string().trim().min(3, "Goal is required").max(200),
});

export const eventFilterSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
});

export const eventSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(140),
  description: z
    .string()
    .trim()
    .min(20, "Describe the event in at least 20 characters")
    .max(4000),
  location: z.string().trim().min(2, "Location is required").max(180),
  startsAt: z.string().min(1, "Start date is required"),
  endsAt: z.string().optional(),
  capacity: z.string().optional(),
});

export type JobFilterValues = z.infer<typeof jobFilterSchema>;
export type JobFormValues = z.infer<typeof jobSchema>;
export type ApplyFormValues = z.infer<typeof applySchema>;
export type MentorFilterValues = z.infer<typeof mentorFilterSchema>;
export type MentorshipRequestValues = z.infer<typeof mentorshipRequestSchema>;
export type MentorshipGoalValues = z.infer<typeof mentorshipGoalSchema>;
export type EventFilterValues = z.infer<typeof eventFilterSchema>;
export type EventFormValues = z.infer<typeof eventSchema>;
