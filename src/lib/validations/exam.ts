import { z } from "zod";

export const examSchema = z.object({
  title: z
    .string()
    .min(3, "Exam title must be at least 3 characters")
    .max(100, "Exam title must be under 100 characters"),
  description: z.string().optional(),
  durationMinutes: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(360, "Duration cannot exceed 360 minutes"),
  totalMarks: z.number().min(1, "Total marks must be greater than 0"),
  passingMarks: z.number().min(1, "Passing marks must be greater than 0"),
  isPublished: z.boolean(),
});

export type ExamFormValues = z.infer<typeof examSchema>;
