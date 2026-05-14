import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateContentRoot } from "./contentValidator.js";

describe("validateContentRoot", () => {
  it("accepts a valid story folder with one chapter", async () => {
    const root = await mkdtemp(join(tmpdir(), "content-valid-"));
    const storyDir = join(root, "demo-story");
    await mkdir(join(storyDir, "chapters"), { recursive: true });
    await writeFile(
      join(storyDir, "metadata.json"),
      JSON.stringify({
        slug: "demo-story",
        title: "Demo Story",
        author: "Tester",
        description: "A test story.",
        status: "completed",
        language: "vi",
        tags: ["demo"],
        cover: null,
        chapters: [
          {
            slug: "chapter-01",
            title: "Chapter 1",
            order: 1,
            file: "chapters/chapter-01.md"
          }
        ]
      })
    );
    await writeFile(join(storyDir, "chapters/chapter-01.md"), "# Chapter 1\n\nBody");

    const result = await validateContentRoot(root);

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects duplicate chapter order", async () => {
    const root = await mkdtemp(join(tmpdir(), "content-invalid-"));
    const storyDir = join(root, "demo-story");
    await mkdir(join(storyDir, "chapters"), { recursive: true });
    await writeFile(join(storyDir, "chapters/a.md"), "# A");
    await writeFile(join(storyDir, "chapters/b.md"), "# B");
    await writeFile(
      join(storyDir, "metadata.json"),
      JSON.stringify({
        slug: "demo-story",
        title: "Demo Story",
        author: "Tester",
        description: "A test story.",
        status: "completed",
        language: "vi",
        tags: ["demo"],
        cover: null,
        chapters: [
          { slug: "a", title: "A", order: 1, file: "chapters/a.md" },
          { slug: "b", title: "B", order: 1, file: "chapters/b.md" }
        ]
      })
    );

    const result = await validateContentRoot(root);

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toContain("duplicate chapter order");
  });
});
