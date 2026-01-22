import { z } from "zod";

export const questionSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title must be less than 200 characters"),
  body: z
    .string()
    .min(50, "Body must be at least 50 characters")
    .max(5000, "Body must be less than 5000 characters"),
  contextType: z.enum([
    "REHEARSAL",
    "SHOW",
    "TOURING",
    "FUNDING",
    "TEAM",
    "AUDIENCE",
    "OTHER",
  ]),
  stakes: z.string().max(1000).optional(),
  constraints: z.string().max(1000).optional(),
  tried: z.string().max(1000).optional(),
  sensitivityNote: z.string().max(500).optional(),
  requestExpert: z.boolean().default(false),
  tagIds: z.array(z.string()).max(5, "Maximum 5 tags allowed").optional(),
});

export const replySchema = z.object({
  body: z
    .string()
    .min(20, "Reply must be at least 20 characters")
    .max(5000, "Reply must be less than 5000 characters"),
  isExpertPerspective: z.boolean().default(false),
});

export const flagSchema = z.object({
  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must be less than 500 characters"),
  questionId: z.string().optional(),
  replyId: z.string().optional(),
});

export const userProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  expertiseAreas: z.array(z.string()).max(10).optional(),
});

export type QuestionInput = z.infer<typeof questionSchema>;
export type ReplyInput = z.infer<typeof replySchema>;
export type FlagInput = z.infer<typeof flagSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
