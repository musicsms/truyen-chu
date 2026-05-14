import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { storyMetadataSchema } from "../domain/metadataSchema.js";

export type ValidationResult = {
  ok: boolean;
  errors: string[];
};

export async function validateContentRoot(contentRoot: string): Promise<ValidationResult> {
  const errors: string[] = [];
  const storySlugs = new Set<string>();
  const entries = await readdir(contentRoot, { withFileTypes: true });

  for (const entry of entries.filter((item) => item.isDirectory())) {
    const storyDir = resolve(contentRoot, entry.name);
    const metadataPath = resolve(storyDir, "metadata.json");
    const raw = await readFile(metadataPath, "utf8").catch((error: unknown) => {
      errors.push(`${entry.name}: metadata.json missing or unreadable: ${String(error)}`);
      return null;
    });
    if (raw === null) continue;

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch (error) {
      errors.push(`${entry.name}: metadata.json is invalid JSON: ${String(error)}`);
      continue;
    }

    const metadataResult = storyMetadataSchema.safeParse(parsedJson);
    if (!metadataResult.success) {
      errors.push(`${entry.name}: invalid metadata: ${metadataResult.error.message}`);
      continue;
    }

    const metadata = metadataResult.data;
    if (storySlugs.has(metadata.slug)) {
      errors.push(`${metadata.slug}: duplicate story slug`);
    }
    storySlugs.add(metadata.slug);

    const chapterSlugs = new Set<string>();
    const chapterOrders = new Set<number>();

    for (const chapter of metadata.chapters) {
      if (chapterSlugs.has(chapter.slug)) {
        errors.push(`${metadata.slug}/${chapter.slug}: duplicate chapter slug`);
      }
      chapterSlugs.add(chapter.slug);

      if (chapterOrders.has(chapter.order)) {
        errors.push(`${metadata.slug}/${chapter.slug}: duplicate chapter order ${chapter.order}`);
      }
      chapterOrders.add(chapter.order);

      const chapterPath = resolve(storyDir, chapter.file);
      if (!chapterPath.startsWith(storyDir + sep)) {
        errors.push(`${metadata.slug}/${chapter.slug}: chapter file escapes story folder`);
        continue;
      }

      const chapterStat = await stat(chapterPath).catch(() => null);
      if (!chapterStat?.isFile()) {
        errors.push(`${metadata.slug}/${chapter.slug}: chapter file missing`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
