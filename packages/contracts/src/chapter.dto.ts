import { z } from "zod";
import { DocumentAstSchema } from "./document-ast.dto.js";

export const ChapterSummarySchema = z.object({
  storySlug: z.string(),
  slug: z.string(),
  title: z.string(),
  order: z.number().int().positive(),
  wordCount: z.number().int().nonnegative().nullable()
});

export const ChapterDocumentSchema = z.object({
  storySlug: z.string(),
  chapterSlug: z.string(),
  title: z.string(),
  order: z.number().int().positive(),
  sourceFormat: z.literal("markdown"),
  wordCount: z.number().int().nonnegative(),
  checksum: z.string(),
  document: DocumentAstSchema
});

export type ChapterSummary = z.infer<typeof ChapterSummarySchema>;
export type ChapterDocument = z.infer<typeof ChapterDocumentSchema>;
