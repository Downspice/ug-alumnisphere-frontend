import { z } from "zod";

export const campaignFilterSchema = z.object({
  search: z.string().optional(),
});

export const campaignSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(140),
  description: z.string().trim().min(20, "Describe the campaign in at least 20 characters").max(4000),
  goalAmount: z.string().min(1, "Goal is required"),
  deadline: z.string().optional(),
});

export const contributionSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((value) => Number(value) >= 1, "Amount must be at least GHS 1"),
  anonymous: z.boolean(),
  note: z.string().max(400).optional(),
});

export type CampaignFilterValues = z.infer<typeof campaignFilterSchema>;
export type CampaignFormValues = z.infer<typeof campaignSchema>;
export type ContributionFormValues = z.infer<typeof contributionSchema>;
