import { describe, expect, it } from "vitest";
import { ChapterDocumentSchema } from "./chapter.dto.js";

describe("ChapterDocumentSchema", () => {
  it("accepts a minimal chapter document with AST blocks", () => {
    const parsed = ChapterDocumentSchema.parse({
      storySlug: "mua-tren-ben-khong-den",
      chapterSlug: "chuong-01-xac-duoi-mai-hien",
      title: "Chương 1: Xác dưới mái hiên",
      order: 1,
      sourceFormat: "markdown",
      wordCount: 2386,
      checksum: "sha256-test",
      document: {
        version: 1,
        blocks: [
          {
            id: "b0001",
            type: "heading",
            level: 1,
            children: [{ type: "text", text: "Chương 1: Xác dưới mái hiên" }]
          }
        ]
      }
    });

    expect(parsed.document.blocks[0]?.type).toBe("heading");
  });
});
