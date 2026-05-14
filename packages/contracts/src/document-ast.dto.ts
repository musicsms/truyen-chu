import { z } from "zod";

export const InlineTextNodeSchema = z.object({
  type: z.literal("text"),
  text: z.string()
});

export const InlineStrongNodeSchema = z.object({
  type: z.literal("strong"),
  children: z.array(InlineTextNodeSchema)
});

export const InlineEmphasisNodeSchema = z.object({
  type: z.literal("emphasis"),
  children: z.array(InlineTextNodeSchema)
});

export const InlineNodeSchema = z.discriminatedUnion("type", [
  InlineTextNodeSchema,
  InlineStrongNodeSchema,
  InlineEmphasisNodeSchema
]);

export const HeadingBlockSchema = z.object({
  id: z.string(),
  type: z.literal("heading"),
  level: z.number().int().min(1).max(6),
  children: z.array(InlineNodeSchema)
});

export const ParagraphBlockSchema = z.object({
  id: z.string(),
  type: z.literal("paragraph"),
  children: z.array(InlineNodeSchema)
});

export const BlockquoteBlockSchema = z.object({
  id: z.string(),
  type: z.literal("blockquote"),
  children: z.array(ParagraphBlockSchema)
});

export const DividerBlockSchema = z.object({
  id: z.string(),
  type: z.literal("divider")
});

export const DocumentBlockSchema = z.discriminatedUnion("type", [
  HeadingBlockSchema,
  ParagraphBlockSchema,
  BlockquoteBlockSchema,
  DividerBlockSchema
]);

export const DocumentAstSchema = z.object({
  version: z.literal(1),
  blocks: z.array(DocumentBlockSchema).min(1)
});

export type InlineNode = z.infer<typeof InlineNodeSchema>;
export type DocumentBlock = z.infer<typeof DocumentBlockSchema>;
export type DocumentAst = z.infer<typeof DocumentAstSchema>;
