import { z } from "zod";

export const directoryFilterSchema = z.object({
  query: z.string().optional(),
  programme: z.string().optional(),
  department: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  skill: z.string().optional(),
  graduationYear: z.string().optional(),
  verificationStatus: z.enum(["any", "verified", "pending", "unverified", "rejected"]),
  openToMentor: z.boolean(),
  openToWork: z.boolean(),
  sort: z.enum(["RECENT", "NAME_ASC", "YEAR_DESC"]),
});

export const verificationSchema = z.object({
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, "Enter a four-digit year")
    .refine((value) => Number(value) >= 1950 && Number(value) <= 2100, "Year must be 1950–2100"),
  programme: z.string().min(2, "Programme is required"),
  studentNumber: z.string().min(3, "Student or index number is required"),
  notes: z.string().max(1000).optional(),
  document: z.any().optional(),
});

export const rejectionSchema = z.object({
  rejectionReason: z.string().min(8, "Give a clear reason for rejection"),
});

export type DirectoryFilterValues = z.infer<typeof directoryFilterSchema>;
export type VerificationFormValues = z.infer<typeof verificationSchema>;
export type RejectionFormValues = z.infer<typeof rejectionSchema>;
