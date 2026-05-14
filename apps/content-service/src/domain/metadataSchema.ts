import { z } from "zod";

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const chapterMetadataSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  order: z.number().int().positive(),
  file: z.string().min(1)
});

export const storyMetadataSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(["ongoing", "completed", "hiatus"]),
  language: z.string().min(2),
  tags: z.array(z.string().min(1)),
  cover: z.string().nullable(),
  chapters: z.array(chapterMetadataSchema).min(1)
});

export type StoryMetadata = z.infer<typeof storyMetadataSchema>;
