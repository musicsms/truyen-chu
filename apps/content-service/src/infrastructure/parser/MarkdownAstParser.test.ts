import { describe, expect, it } from "vitest";
import { parseMarkdownToAst } from "./MarkdownAstParser.js";

describe("parseMarkdownToAst", () => {
  it("parses heading, paragraph, emphasis, strong, blockquote, and divider", () => {
    const ast = parseMarkdownToAst([
      "# Title",
      "",
      "A **bold** and *soft* line.",
      "",
      "> Quoted line.",
      "",
      "---"
    ].join("\n"));

    expect(ast).toEqual({
      version: 1,
      blocks: [
        {
          id: "b0001",
          type: "heading",
          level: 1,
          children: [{ type: "text", text: "Title" }]
        },
        {
          id: "b0002",
          type: "paragraph",
          children: [
            { type: "text", text: "A " },
            { type: "strong", children: [{ type: "text", text: "bold" }] },
            { type: "text", text: " and " },
            { type: "emphasis", children: [{ type: "text", text: "soft" }] },
            { type: "text", text: " line." }
          ]
        },
        {
          id: "b0003",
          type: "blockquote",
          children: [
            {
              id: "b0003-p0001",
              type: "paragraph",
              children: [{ type: "text", text: "Quoted line." }]
            }
          ]
        },
        { id: "b0004", type: "divider" }
      ]
    });
  });
});
