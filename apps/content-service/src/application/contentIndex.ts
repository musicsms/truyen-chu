import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { StorySummary, ChapterDocument, ChapterSummary } from "@truyen/contracts";
import { StoryMetadata, storyMetadataSchema } from "../domain/metadataSchema.js";
import { parseMarkdownToAst } from "../infrastructure/parser/MarkdownAstParser.js";

export type StoryRecord = {
  dir: string;
  metadata: StoryMetadata;
};

export type ContentIndex = {
  contentRoot: string;
  stories: Map<string, StoryRecord>;
};

function absoluteFromRoot(path: string): string {
  if (isAbsolute(path)) return path;
  return resolve(process.env.INIT_CWD ?? process.cwd(), path);
}

export async function buildContentIndex(contentRoot: string): Promise<ContentIndex> {
  const root = absoluteFromRoot(contentRoot);
  const stories = new Map<string, StoryRecord>();
  const entries = await readdir(root, { withFileTypes: true });

  for (const entry of entries.filter((item) => item.isDirectory())) {
    const dir = resolve(root, entry.name);
    const raw = await readFile(resolve(dir, "metadata.json"), "utf8");
    const metadata = storyMetadataSchema.parse(JSON.parse(raw));
    stories.set(metadata.slug, { dir, metadata });
  }

  return { contentRoot: root, stories };
}

export function listStorySummaries(index: ContentIndex): StorySummary[] {
  return [...index.stories.values()].map(({ metadata }) => ({
    slug: metadata.slug,
    title: metadata.title,
    author: metadata.author,
    description: metadata.description,
    status: metadata.status,
    language: metadata.language,
    tags: metadata.tags,
    coverUrl: metadata.cover === null ? null : `/api/v1/stories/${metadata.slug}/cover`,
    chapterCount: metadata.chapters.length
  }));
}

export function getStoryRecord(index: ContentIndex, storySlug: string): StoryRecord | null {
  return index.stories.get(storySlug) ?? null;
}

export function listChapterSummaries(record: StoryRecord): ChapterSummary[] {
  return [...record.metadata.chapters]
    .sort((a, b) => a.order - b.order)
    .map((chapter) => ({
      storySlug: record.metadata.slug,
      slug: chapter.slug,
      title: chapter.title,
      order: chapter.order,
      wordCount: null
    }));
}

export async function getChapterSource(record: StoryRecord, chapterSlug: string): Promise<string | null> {
  const chapter = record.metadata.chapters.find((item) => item.slug === chapterSlug);
  if (!chapter) return null;
  return readFile(resolve(record.dir, chapter.file), "utf8");
}

export async function getChapterDocument(
  record: StoryRecord,
  chapterSlug: string
): Promise<ChapterDocument | null> {
  const chapter = record.metadata.chapters.find((item) => item.slug === chapterSlug);
  if (!chapter) return null;

  const sourcePath = resolve(record.dir, chapter.file);
  const source = await readFile(sourcePath, "utf8");
  const sourceStat = await stat(sourcePath);
  const checksum = createHash("sha256")
    .update(source)
    .update(String(sourceStat.mtimeMs))
    .digest("hex");

  return {
    storySlug: record.metadata.slug,
    chapterSlug: chapter.slug,
    title: chapter.title,
    order: chapter.order,
    sourceFormat: "markdown",
    wordCount: source.split(/\s+/).filter(Boolean).length,
    checksum,
    document: parseMarkdownToAst(source)
  };
}
