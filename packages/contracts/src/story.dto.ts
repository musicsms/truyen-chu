import { z } from "zod";

export const StoryStatusSchema = z.enum(["ongoing", "completed", "hiatus"]);

export const StorySummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  status: StoryStatusSchema,
  language: z.string(),
  tags: z.array(z.string()),
  coverUrl: z.string().nullable(),
  chapterCount: z.number().int().nonnegative()
});

export const StoryDetailSchema = StorySummarySchema.extend({
  updatedAt: z.string().nullable()
});

export type StoryStatus = z.infer<typeof StoryStatusSchema>;
export type StorySummary = z.infer<typeof StorySummarySchema>;
export type StoryDetail = z.infer<typeof StoryDetailSchema>;
