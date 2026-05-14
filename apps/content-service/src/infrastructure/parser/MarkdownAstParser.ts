import { DocumentAst, InlineNode } from "@truyen/contracts";
import remarkParse from "remark-parse";
import { unified } from "unified";

type MdNode = {
  type: string;
  value?: string;
  depth?: number;
  children?: MdNode[];
};

function nextBlockId(index: number): string {
  return `b${String(index).padStart(4, "0")}`;
}

function textChildren(nodes: MdNode[] = []): Array<{ type: "text"; text: string }> {
  return nodes.map((node) => {
    if (node.type !== "text") {
      throw new Error(`Unsupported nested inline markdown node: ${node.type}`);
    }
    return { type: "text", text: node.value ?? "" };
  });
}

function inlineChildren(nodes: MdNode[] = []): InlineNode[] {
  return nodes.flatMap((node): InlineNode[] => {
    if (node.type === "text") {
      return [{ type: "text", text: node.value ?? "" }];
    }
    if (node.type === "strong") {
      return [{ type: "strong", children: textChildren(node.children) }];
    }
    if (node.type === "emphasis") {
      return [{ type: "emphasis", children: textChildren(node.children) }];
    }
    if (node.type === "break") {
      return [{ type: "text", text: "\n" }];
    }
    throw new Error(`Unsupported inline markdown node: ${node.type}`);
  });
}

export function parseMarkdownToAst(markdown: string): DocumentAst {
  const tree = unified().use(remarkParse).parse(markdown) as MdNode;
  const blocks: DocumentAst["blocks"] = [];

  for (const node of tree.children ?? []) {
    const id = nextBlockId(blocks.length + 1);
    if (node.type === "heading") {
      blocks.push({
        id,
        type: "heading",
        level: node.depth ?? 1,
        children: inlineChildren(node.children)
      });
      continue;
    }

    if (node.type === "paragraph") {
      blocks.push({
        id,
        type: "paragraph",
        children: inlineChildren(node.children)
      });
      continue;
    }

    if (node.type === "blockquote") {
      const paragraphs = (node.children ?? []).map((child, index) => {
        if (child.type !== "paragraph") {
          throw new Error(`Unsupported blockquote markdown node: ${child.type}`);
        }
        return {
          id: `${id}-p${String(index + 1).padStart(4, "0")}`,
          type: "paragraph" as const,
          children: inlineChildren(child.children)
        };
      });
      blocks.push({ id, type: "blockquote", children: paragraphs });
      continue;
    }

    if (node.type === "thematicBreak") {
      blocks.push({ id, type: "divider" });
      continue;
    }

    throw new Error(`Unsupported markdown block node: ${node.type}`);
  }

  if (blocks.length === 0) {
    throw new Error("Markdown parsed to empty AST");
  }

  return { version: 1, blocks };
}
