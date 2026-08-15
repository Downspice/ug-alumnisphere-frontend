import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().max(80).optional(),
});

export const messageSchema = z.object({
  body: z.string().trim().min(1, "Write a message").max(2000),
});

export const communitySchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(80),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean(),
  cover: z.any().optional(),
});

export const postSchema = z
  .object({
    type: z.enum(["text", "link", "poll", "image"]),
    image: z.any().optional(),
    body: z.string().max(4000).optional(),
    linkUrl: z.string().optional(),
    pollQuestion: z.string().max(240).optional(),
    option1: z.string().max(80).optional(),
    option2: z.string().max(80).optional(),
    option3: z.string().max(80).optional(),
    option4: z.string().max(80).optional(),
    pollClosesAt: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type === "image" && !values.image) {
      ctx.addIssue({
        code: "custom",
        path: ["image"],
        message: "Choose an image before posting.",
      });
    }
    if (values.type === "text" && !values.body?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["body"],
        message: "Write something before posting.",
      });
    }
    if (values.type === "link") {
      const url = values.linkUrl?.trim() ?? "";
      if (!/^https?:\/\//.test(url)) {
        ctx.addIssue({
          code: "custom",
          path: ["linkUrl"],
          message: "Enter a valid http(s) link.",
        });
      }
    }
    if (values.type === "poll") {
      if (!values.pollQuestion?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["pollQuestion"],
          message: "Polls need a question.",
        });
      }
      const options = [values.option1, values.option2, values.option3, values.option4]
        .map((item) => item?.trim())
        .filter(Boolean);
      if (options.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["option2"],
          message: "Add at least two poll options.",
        });
      }
    }
  });

export const commentSchema = z.object({
  body: z.string().trim().min(1, "Write a comment").max(1500),
});

export const reportSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(8, "Explain why you are reporting this (8+ characters)")
    .max(400),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
export type MessageFormValues = z.infer<typeof messageSchema>;
export type CommunityFormValues = z.infer<typeof communitySchema>;
export type PostFormValues = z.infer<typeof postSchema>;
export type CommentFormValues = z.infer<typeof commentSchema>;
export type ReportFormValues = z.infer<typeof reportSchema>;
