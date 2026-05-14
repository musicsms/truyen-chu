# Reader Platform Microservices Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the V1 Android story reader platform with Flutter client, API Gateway, Content Service, shared contracts, and Markdown story content served as Document AST.

**Architecture:** The system is a microservices monorepo. Flutter calls only the API Gateway; Gateway forwards public `/api/v1` requests to the internal Content Service; Content Service validates Markdown story folders and parses chapters into versioned Document AST. Shared DTO/schema definitions live in `packages/contracts`.

**Tech Stack:** npm workspaces, Node.js 20, TypeScript, Fastify, Zod, Vitest, unified/remark-parse, Flutter Android, Riverpod, Hive, Docker Compose, Caddy reverse proxy.

---

## Source Specs

- `docs/superpowers/specs/2026-05-14-flutter-reader-server-design.md`
- `docs/superpowers/specs/2026-05-14-reader-platform-microservices-architecture.md`

## Global Decisions

- Use `npm` workspaces at repo root.
- Use `vitest` for Node service tests.
- Use `zod` for runtime DTO validation and metadata validation.
- Use `unified` + `remark-parse` to parse Markdown.
- Use Caddy in Docker Compose because it gives simple HTTPS-ready reverse proxy config.
- Use Flutter Riverpod for client state and Hive for local chapter/progress cache.
- Keep `docs/kiem-hiep` as writing documentation. Copy chapter files into `content/stories` for runtime content.

## File Structure

- Create: `package.json` for npm workspaces.
- Create: `.gitignore` for generated app/build/cache files.
- Create: `.nvmrc` to pin Node.js major version.
- Create: `packages/contracts/package.json`
- Create: `packages/contracts/tsconfig.json`
- Create: `packages/contracts/src/story.dto.ts`
- Create: `packages/contracts/src/chapter.dto.ts`
- Create: `packages/contracts/src/document-ast.dto.ts`
- Create: `packages/contracts/src/error.dto.ts`
- Create: `packages/contracts/src/index.ts`
- Create: `packages/contracts/src/*.test.ts`
- Create: `content/stories/mua-tren-ben-khong-den/metadata.json`
- Create: `content/stories/mua-tren-ben-khong-den/chapters/*.md`
- Create: `apps/content-service/package.json`
- Create: `apps/content-service/tsconfig.json`
- Create: `apps/content-service/vitest.config.ts`
- Create: `apps/content-service/src/config/env.ts`
- Create: `apps/content-service/src/domain/contentTypes.ts`
- Create: `apps/content-service/src/domain/metadataSchema.ts`
- Create: `apps/content-service/src/domain/documentAstSchema.ts`
- Create: `apps/content-service/src/infrastructure/contentStore/FileSystemContentStore.ts`
- Create: `apps/content-service/src/infrastructure/parser/MarkdownAstParser.ts`
- Create: `apps/content-service/src/infrastructure/cache/MemoryChapterCache.ts`
- Create: `apps/content-service/src/application/contentIndex.ts`
- Create: `apps/content-service/src/application/contentValidator.ts`
- Create: `apps/content-service/src/api/routes/healthRoutes.ts`
- Create: `apps/content-service/src/api/routes/storyRoutes.ts`
- Create: `apps/content-service/src/api/routes/chapterRoutes.ts`
- Create: `apps/content-service/src/api/errors.ts`
- Create: `apps/content-service/src/api/etag.ts`
- Create: `apps/content-service/src/app.ts`
- Create: `apps/content-service/src/server.ts`
- Create: `apps/content-service/src/cli/contentValidate.ts`
- Create: `apps/api-gateway/package.json`
- Create: `apps/api-gateway/tsconfig.json`
- Create: `apps/api-gateway/vitest.config.ts`
- Create: `apps/api-gateway/src/config/env.ts`
- Create: `apps/api-gateway/src/clients/contentClient.ts`
- Create: `apps/api-gateway/src/middleware/requestId.ts`
- Create: `apps/api-gateway/src/middleware/errorHandler.ts`
- Create: `apps/api-gateway/src/routes/healthRoutes.ts`
- Create: `apps/api-gateway/src/routes/storyRoutes.ts`
- Create: `apps/api-gateway/src/routes/chapterRoutes.ts`
- Create: `apps/api-gateway/src/app.ts`
- Create: `apps/api-gateway/src/server.ts`
- Create: `docker-compose.yml`
- Create: `ops/caddy/Caddyfile`
- Create: `.env.example`
- Create: `apps/mobile-reader/` using `flutter create`
- Create: `apps/mobile-reader/lib/core/api/reader_api_client.dart`
- Create: `apps/mobile-reader/lib/core/storage/local_cache.dart`
- Create: `apps/mobile-reader/lib/core/theme/reader_theme.dart`
- Create: `apps/mobile-reader/lib/features/library/`
- Create: `apps/mobile-reader/lib/features/story_detail/`
- Create: `apps/mobile-reader/lib/features/reader/`
- Create: `apps/mobile-reader/lib/features/settings/`

## Tasks

### Task 1: Create Monorepo Foundation

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.nvmrc`

- [ ] **Step 1: Write root workspace files**

Create `package.json`:

```json
{
  "name": "truyen-chu",
  "private": true,
  "workspaces": [
    "apps/api-gateway",
    "apps/content-service",
    "packages/contracts"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "content:validate": "npm run content:validate -w apps/content-service"
  },
  "engines": {
    "node": ">=20 <21"
  }
}
```

Create `.nvmrc`:

```text
20
```

Create `.gitignore`:

```gitignore
node_modules/
dist/
coverage/
.env
.DS_Store
.superpowers/

apps/mobile-reader/.dart_tool/
apps/mobile-reader/build/
apps/mobile-reader/.flutter-plugins
apps/mobile-reader/.flutter-plugins-dependencies
apps/mobile-reader/android/.gradle/
```

- [ ] **Step 2: Verify npm workspace root**

Run: `npm install --package-lock-only`

Expected: `package-lock.json` is created and command exits 0.

- [ ] **Step 3: Commit foundation**

Run:

```bash
git add package.json package-lock.json .gitignore .nvmrc
git commit -m "chore: add monorepo foundation"
```

Expected: commit succeeds.

### Task 2: Implement Shared Contracts Package

**Files:**
- Create: `packages/contracts/package.json`
- Create: `packages/contracts/tsconfig.json`
- Create: `packages/contracts/src/document-ast.dto.ts`
- Create: `packages/contracts/src/story.dto.ts`
- Create: `packages/contracts/src/chapter.dto.ts`
- Create: `packages/contracts/src/error.dto.ts`
- Create: `packages/contracts/src/index.ts`
- Create: `packages/contracts/src/document-ast.dto.test.ts`

- [ ] **Step 1: Create package config**

Create `packages/contracts/package.json`:

```json
{
  "name": "@truyen/contracts",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run"
  },
  "dependencies": {
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "vitest": "^2.1.1"
  }
}
```

Create `packages/contracts/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "outDir": "dist",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 2: Write Document AST schema**

Create `packages/contracts/src/document-ast.dto.ts`:

```ts
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
```

- [ ] **Step 3: Write story, chapter, and error DTOs**

Create `packages/contracts/src/story.dto.ts`:

```ts
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
```

Create `packages/contracts/src/chapter.dto.ts`:

```ts
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
```

Create `packages/contracts/src/error.dto.ts`:

```ts
import { z } from "zod";

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
    requestId: z.string().optional()
  })
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
```

Create `packages/contracts/src/index.ts`:

```ts
export * from "./document-ast.dto.js";
export * from "./story.dto.js";
export * from "./chapter.dto.js";
export * from "./error.dto.js";
```

- [ ] **Step 4: Write contract validation test**

Create `packages/contracts/src/document-ast.dto.test.ts`:

```ts
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
```

- [ ] **Step 5: Run contract tests**

Run: `npm install && npm test -w packages/contracts`

Expected: tests pass.

- [ ] **Step 6: Commit contracts**

Run:

```bash
git add package-lock.json packages/contracts
git commit -m "feat: add shared reader contracts"
```

Expected: commit succeeds.

### Task 3: Migrate Story Content Into Runtime Layout

**Files:**
- Create: `content/stories/mua-tren-ben-khong-den/metadata.json`
- Create: `content/stories/mua-tren-ben-khong-den/chapters/*.md`

- [ ] **Step 1: Create content folders**

Run:

```bash
mkdir -p content/stories/mua-tren-ben-khong-den/chapters
```

Expected: folder exists.

- [ ] **Step 2: Copy final chapter Markdown files**

Run:

```bash
cp docs/kiem-hiep/manuscript/final/chuong-*.md content/stories/mua-tren-ben-khong-den/chapters/
```

Expected: 24 chapter files exist under `content/stories/mua-tren-ben-khong-den/chapters/`.

- [ ] **Step 3: Write metadata**

Create `content/stories/mua-tren-ben-khong-den/metadata.json`:

```json
{
  "slug": "mua-tren-ben-khong-den",
  "title": "Mưa Trên Bến Không Đèn",
  "author": "Local",
  "description": "Một truyện kiếm hiệp trinh thám/noir về oan án, hồ sơ bị sửa, và cái giá của công lý.",
  "status": "completed",
  "language": "vi",
  "tags": ["kiem-hiep", "noir", "trinh-tham"],
  "cover": null,
  "chapters": [
    {
      "slug": "chuong-01-xac-duoi-mai-hien",
      "title": "Chương 1: Xác dưới mái hiên",
      "order": 1,
      "file": "chapters/chuong-01-xac-duoi-mai-hien.md"
    },
    {
      "slug": "chuong-02-nguoi-va-luoi-rut-kiem",
      "title": "Chương 2: Người vá lưới rút kiếm",
      "order": 2,
      "file": "chapters/chuong-02-nguoi-va-luoi-rut-kiem.md"
    },
    {
      "slug": "chuong-03-quan-mua-khong-treo-bang",
      "title": "Chương 3: Quán Mưa không treo bảng",
      "order": 3,
      "file": "chapters/chuong-03-quan-mua-khong-treo-bang.md"
    },
    {
      "slug": "chuong-04-nguoi-nghiem-thi",
      "title": "Chương 4: Người nghiệm thi",
      "order": 4,
      "file": "chapters/chuong-04-nguoi-nghiem-thi.md"
    },
    {
      "slug": "chuong-05-ho-so-bi-sua",
      "title": "Chương 5: Hồ sơ bị sửa",
      "order": 5,
      "file": "chapters/chuong-05-ho-so-bi-sua.md"
    },
    {
      "slug": "chuong-06-ben-khong-den",
      "title": "Chương 6: Bến không đèn",
      "order": 6,
      "file": "chapters/chuong-06-ben-khong-den.md"
    },
    {
      "slug": "chuong-07-nguoi-cheo-do-ten-tram",
      "title": "Chương 7: Người chèo đò tên Trạm",
      "order": 7,
      "file": "chapters/chuong-07-nguoi-cheo-do-ten-tram.md"
    },
    {
      "slug": "chuong-08-tieu-cuc-hoi-phong",
      "title": "Chương 8: Tiêu cục Hồi Phong",
      "order": 8,
      "file": "chapters/chuong-08-tieu-cuc-hoi-phong.md"
    },
    {
      "slug": "chuong-09-hem-kim-chi",
      "title": "Chương 9: Hẻm Kim Chỉ",
      "order": 9,
      "file": "chapters/chuong-09-hem-kim-chi.md"
    },
    {
      "slug": "chuong-10-phap-truong-dong-khau",
      "title": "Chương 10: Pháp trường Đông Khẩu",
      "order": 10,
      "file": "chapters/chuong-10-phap-truong-dong-khau.md"
    },
    {
      "slug": "chuong-11-manh-so-trong-tieng-hat",
      "title": "Chương 11: Mảnh sổ trong tiếng hát",
      "order": 11,
      "file": "chapters/chuong-11-manh-so-trong-tieng-hat.md"
    },
    {
      "slug": "chuong-12-dem-chay-quan-mua",
      "title": "Chương 12: Đêm cháy Quán Mưa",
      "order": 12,
      "file": "chapters/chuong-12-dem-chay-quan-mua.md"
    },
    {
      "slug": "chuong-13-loi-thu-cua-nguoi-con-song",
      "title": "Chương 13: Lời thú của người còn sống",
      "order": 13,
      "file": "chapters/chuong-13-loi-thu-cua-nguoi-con-song.md"
    },
    {
      "slug": "chuong-14-chu-tieu-cuc-quy-truoc-ruong-cu",
      "title": "Chương 14: Chủ tiêu cục quỳ trước rương cũ",
      "order": 14,
      "file": "chapters/chuong-14-chu-tieu-cuc-quy-truoc-ruong-cu.md"
    },
    {
      "slug": "chuong-15-nguoi-giet-nguoi-thuan-tay-trai",
      "title": "Chương 15: Người giết người thuận tay trái",
      "order": 15,
      "file": "chapters/chuong-15-nguoi-giet-nguoi-thuan-tay-trai.md"
    },
    {
      "slug": "chuong-16-noi-vien-hoi-thanh-luat",
      "title": "Chương 16: Nội viện Hội Thanh Luật",
      "order": 16,
      "file": "chapters/chuong-16-noi-vien-hoi-thanh-luat.md"
    },
    {
      "slug": "chuong-17-dua-tre-giu-ky-uc",
      "title": "Chương 17: Đứa trẻ giữ ký ức",
      "order": 17,
      "file": "chapters/chuong-17-dua-tre-giu-ky-uc.md"
    },
    {
      "slug": "chuong-18-kho-muoi-van-thach",
      "title": "Chương 18: Kho muối Vạn Thạch",
      "order": 18,
      "file": "chapters/chuong-18-kho-muoi-van-thach.md"
    },
    {
      "slug": "chuong-19-nguoi-giu-luat",
      "title": "Chương 19: Người giữ luật",
      "order": 19,
      "file": "chapters/chuong-19-nguoi-giu-luat.md"
    },
    {
      "slug": "chuong-20-mot-phien-xu-khac",
      "title": "Chương 20: Một phiên xử khác",
      "order": 20,
      "file": "chapters/chuong-20-mot-phien-xu-khac.md"
    },
    {
      "slug": "chuong-21-kim-tuyen-truoc-dan-tran",
      "title": "Chương 21: Kim tuyến trước dân trấn",
      "order": 21,
      "file": "chapters/chuong-21-kim-tuyen-truoc-dan-tran.md"
    },
    {
      "slug": "chuong-22-den-tat-o-phap-truong",
      "title": "Chương 22: Đèn tắt ở pháp trường",
      "order": 22,
      "file": "chapters/chuong-22-den-tat-o-phap-truong.md"
    },
    {
      "slug": "chuong-23-cai-gia-cua-cong-bo",
      "title": "Chương 23: Cái giá của công bố",
      "order": 23,
      "file": "chapters/chuong-23-cai-gia-cua-cong-bo.md"
    },
    {
      "slug": "chuong-24-mua-sau-ben",
      "title": "Chương 24: Mưa sau bến",
      "order": 24,
      "file": "chapters/chuong-24-mua-sau-ben.md"
    }
  ]
}
```

- [ ] **Step 4: Verify chapter count**

Run: `find content/stories/mua-tren-ben-khong-den/chapters -name '*.md' | wc -l`

Expected: `24`.

- [ ] **Step 5: Commit content migration**

Run:

```bash
git add content/stories/mua-tren-ben-khong-den
git commit -m "feat: add runtime story content"
```

Expected: commit succeeds.

### Task 4: Build Content Service Validation Core

**Files:**
- Create: `apps/content-service/package.json`
- Create: `apps/content-service/tsconfig.json`
- Create: `apps/content-service/vitest.config.ts`
- Create: `apps/content-service/src/domain/metadataSchema.ts`
- Create: `apps/content-service/src/infrastructure/contentStore/FileSystemContentStore.ts`
- Create: `apps/content-service/src/application/contentValidator.ts`
- Create: `apps/content-service/src/cli/contentValidate.ts`
- Test: `apps/content-service/src/application/contentValidator.test.ts`

- [ ] **Step 1: Create service package config**

Create `apps/content-service/package.json`:

```json
{
  "name": "@truyen/content-service",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "content:validate": "tsx src/cli/contentValidate.ts"
  },
  "dependencies": {
    "@truyen/contracts": "0.1.0",
    "@fastify/cors": "^10.0.1",
    "fastify": "^5.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.7.4",
    "tsx": "^4.19.1",
    "typescript": "^5.6.3",
    "vitest": "^2.1.1"
  }
}
```

Create `apps/content-service/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

Create `apps/content-service/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node"
  }
});
```

- [ ] **Step 2: Write failing validator test**

Create `apps/content-service/src/application/contentValidator.test.ts`:

```ts
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
```

- [ ] **Step 3: Run failing validator test**

Run: `npm test -w apps/content-service -- contentValidator.test.ts`

Expected: FAIL because `contentValidator.js` does not exist.

- [ ] **Step 4: Implement metadata schema and validator**

Create `apps/content-service/src/domain/metadataSchema.ts`:

```ts
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
```

Create `apps/content-service/src/application/contentValidator.ts`:

```ts
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

    const parsedJson = JSON.parse(raw) as unknown;
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
```

Create `apps/content-service/src/cli/contentValidate.ts`:

```ts
import { resolve } from "node:path";
import { validateContentRoot } from "../application/contentValidator.js";

const contentRoot = resolve(process.env.CONTENT_ROOT ?? "content/stories");
const result = await validateContentRoot(contentRoot);

if (!result.ok) {
  for (const error of result.errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log(`Content validation passed: ${contentRoot}`);
```

- [ ] **Step 5: Run validator tests**

Run: `npm test -w apps/content-service -- contentValidator.test.ts`

Expected: PASS.

- [ ] **Step 6: Validate real content**

Run: `npm run content:validate`

Expected: PASS and prints `Content validation passed`.

- [ ] **Step 7: Commit content validation**

Run:

```bash
git add package-lock.json apps/content-service content/stories
git commit -m "feat: add content validation service"
```

Expected: commit succeeds.

### Task 5: Implement Markdown To AST Parser

**Files:**
- Modify: `apps/content-service/package.json`
- Create: `apps/content-service/src/infrastructure/parser/MarkdownAstParser.ts`
- Test: `apps/content-service/src/infrastructure/parser/MarkdownAstParser.test.ts`

- [ ] **Step 1: Add parser dependencies**

Run: `npm install unified remark-parse unist-util-visit -w apps/content-service`

Expected: dependencies are added to `apps/content-service/package.json` and `package-lock.json`.

- [ ] **Step 2: Write failing parser test**

Create `apps/content-service/src/infrastructure/parser/MarkdownAstParser.test.ts`:

```ts
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
```

- [ ] **Step 3: Run failing parser test**

Run: `npm test -w apps/content-service -- MarkdownAstParser.test.ts`

Expected: FAIL because `MarkdownAstParser.js` does not exist.

- [ ] **Step 4: Implement parser**

Create `apps/content-service/src/infrastructure/parser/MarkdownAstParser.ts`:

```ts
import { DocumentAst, InlineNode } from "@truyen/contracts";
import { unified } from "unified";
import remarkParse from "remark-parse";

type MdNode = {
  type: string;
  value?: string;
  depth?: number;
  children?: MdNode[];
};

function nextBlockId(index: number): string {
  return `b${String(index).padStart(4, "0")}`;
}

function inlineChildren(nodes: MdNode[] = []): InlineNode[] {
  return nodes.flatMap((node): InlineNode[] => {
    if (node.type === "text") {
      return [{ type: "text", text: node.value ?? "" }];
    }
    if (node.type === "strong") {
      return [{ type: "strong", children: inlineChildren(node.children) }];
    }
    if (node.type === "emphasis") {
      return [{ type: "emphasis", children: inlineChildren(node.children) }];
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
```

- [ ] **Step 5: Run parser tests**

Run: `npm test -w apps/content-service -- MarkdownAstParser.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit parser**

Run:

```bash
git add package-lock.json apps/content-service
git commit -m "feat: parse markdown chapters to document ast"
```

Expected: commit succeeds.

### Task 6: Implement Content Service Internal API

**Files:**
- Create: `apps/content-service/src/config/env.ts`
- Create: `apps/content-service/src/application/contentIndex.ts`
- Create: `apps/content-service/src/infrastructure/cache/MemoryChapterCache.ts`
- Create: `apps/content-service/src/api/etag.ts`
- Create: `apps/content-service/src/api/errors.ts`
- Create: `apps/content-service/src/api/routes/healthRoutes.ts`
- Create: `apps/content-service/src/api/routes/storyRoutes.ts`
- Create: `apps/content-service/src/api/routes/chapterRoutes.ts`
- Create: `apps/content-service/src/app.ts`
- Create: `apps/content-service/src/server.ts`
- Test: `apps/content-service/src/api/routes/storyRoutes.test.ts`

- [ ] **Step 1: Write failing route test**

Create `apps/content-service/src/api/routes/storyRoutes.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildContentServiceApp } from "../../app.js";

describe("content service routes", () => {
  it("lists stories from the real content root", async () => {
    const app = await buildContentServiceApp({ contentRoot: "content/stories" });
    const response = await app.inject({ method: "GET", url: "/internal/v1/stories" });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.stories[0].slug).toBe("mua-tren-ben-khong-den");
    expect(body.stories[0].chapterCount).toBe(24);
  });
});
```

- [ ] **Step 2: Run failing route test**

Run: `npm test -w apps/content-service -- storyRoutes.test.ts`

Expected: FAIL because `app.js` does not exist.

- [ ] **Step 3: Implement app and routes**

Implement the route files so `GET /internal/v1/stories` returns:

```json
{
  "stories": [
    {
      "slug": "mua-tren-ben-khong-den",
      "title": "Mưa Trên Bến Không Đèn",
      "author": "Local",
      "description": "Một truyện kiếm hiệp trinh thám/noir về oan án, hồ sơ bị sửa, và cái giá của công lý.",
      "status": "completed",
      "language": "vi",
      "tags": ["kiem-hiep", "noir", "trinh-tham"],
      "coverUrl": null,
      "chapterCount": 24
    }
  ]
}
```

Create `apps/content-service/src/app.ts` with this public function:

```ts
import Fastify from "fastify";
import { registerHealthRoutes } from "./api/routes/healthRoutes.js";
import { registerStoryRoutes } from "./api/routes/storyRoutes.js";
import { registerChapterRoutes } from "./api/routes/chapterRoutes.js";
import { buildContentIndex } from "./application/contentIndex.js";

export async function buildContentServiceApp(options: { contentRoot: string }) {
  const app = Fastify({ logger: false });
  const index = await buildContentIndex(options.contentRoot);

  await registerHealthRoutes(app, index);
  await registerStoryRoutes(app, index);
  await registerChapterRoutes(app, index);

  return app;
}
```

Create `apps/content-service/src/server.ts`:

```ts
import { buildContentServiceApp } from "./app.js";

const port = Number(process.env.CONTENT_SERVICE_PORT ?? "3001");
const host = process.env.HOST ?? "0.0.0.0";
const contentRoot = process.env.CONTENT_ROOT ?? "content/stories";

const app = await buildContentServiceApp({ contentRoot });
await app.listen({ port, host });
```

The implementation must expose:

```text
GET /internal/v1/health
GET /internal/v1/stories
GET /internal/v1/stories/:storySlug
GET /internal/v1/stories/:storySlug/chapters
GET /internal/v1/stories/:storySlug/chapters/:chapterSlug
GET /internal/v1/stories/:storySlug/chapters/:chapterSlug/source
```

- [ ] **Step 4: Run content service tests**

Run: `npm test -w apps/content-service`

Expected: PASS.

- [ ] **Step 5: Smoke test API locally**

Run:

```bash
CONTENT_SERVICE_PORT=3001 npm run build -w apps/content-service
```

Expected: TypeScript build exits 0.

- [ ] **Step 6: Commit content API**

Run:

```bash
git add apps/content-service package-lock.json
git commit -m "feat: expose content service internal api"
```

Expected: commit succeeds.

### Task 7: Implement API Gateway

**Files:**
- Create: `apps/api-gateway/package.json`
- Create: `apps/api-gateway/tsconfig.json`
- Create: `apps/api-gateway/vitest.config.ts`
- Create: `apps/api-gateway/src/config/env.ts`
- Create: `apps/api-gateway/src/clients/contentClient.ts`
- Create: `apps/api-gateway/src/middleware/requestId.ts`
- Create: `apps/api-gateway/src/middleware/errorHandler.ts`
- Create: `apps/api-gateway/src/routes/healthRoutes.ts`
- Create: `apps/api-gateway/src/routes/storyRoutes.ts`
- Create: `apps/api-gateway/src/routes/chapterRoutes.ts`
- Create: `apps/api-gateway/src/app.ts`
- Create: `apps/api-gateway/src/server.ts`
- Test: `apps/api-gateway/src/routes/storyRoutes.test.ts`

- [ ] **Step 1: Create gateway package config**

Create `apps/api-gateway/package.json`:

```json
{
  "name": "@truyen/api-gateway",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "dev": "tsx src/server.ts"
  },
  "dependencies": {
    "@truyen/contracts": "0.1.0",
    "@fastify/cors": "^10.0.1",
    "@fastify/rate-limit": "^10.1.0",
    "fastify": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.7.4",
    "tsx": "^4.19.1",
    "typescript": "^5.6.3",
    "vitest": "^2.1.1"
  }
}
```

Create `apps/api-gateway/tsconfig.json` and `apps/api-gateway/vitest.config.ts` matching the content service config.

- [ ] **Step 2: Write failing gateway test**

Create `apps/api-gateway/src/routes/storyRoutes.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildApiGatewayApp } from "../app.js";

describe("api gateway story routes", () => {
  it("forwards story list requests and propagates request id", async () => {
    const app = await buildApiGatewayApp({
      contentServiceUrl: "mock://content",
      fetchImpl: async (_url, init) => {
        expect(init?.headers).toMatchObject({ "X-Request-Id": "req-test" });
        return new Response(JSON.stringify({ stories: [] }), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/stories",
      headers: { "x-request-id": "req-test" }
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-request-id"]).toBe("req-test");
    expect(response.json()).toEqual({ stories: [] });
  });
});
```

- [ ] **Step 3: Run failing gateway test**

Run: `npm test -w apps/api-gateway -- storyRoutes.test.ts`

Expected: FAIL because `app.js` does not exist.

- [ ] **Step 4: Implement gateway**

Create `apps/api-gateway/src/app.ts`:

```ts
import Fastify from "fastify";
import { registerHealthRoutes } from "./routes/healthRoutes.js";
import { registerStoryRoutes } from "./routes/storyRoutes.js";
import { registerChapterRoutes } from "./routes/chapterRoutes.js";

export type GatewayOptions = {
  contentServiceUrl: string;
  fetchImpl?: typeof fetch;
};

export async function buildApiGatewayApp(options: GatewayOptions) {
  const app = Fastify({ logger: false });
  const fetchImpl = options.fetchImpl ?? fetch;

  app.addHook("onRequest", async (request, reply) => {
    const incoming = request.headers["x-request-id"];
    const requestId = Array.isArray(incoming) ? incoming[0] : incoming ?? crypto.randomUUID();
    request.headers["x-request-id"] = requestId;
    reply.header("X-Request-Id", requestId);
  });

  await registerHealthRoutes(app);
  await registerStoryRoutes(app, { contentServiceUrl: options.contentServiceUrl, fetchImpl });
  await registerChapterRoutes(app, { contentServiceUrl: options.contentServiceUrl, fetchImpl });

  return app;
}
```

Each public route maps `/api/v1/...` to `/internal/v1/...` on Content Service and forwards `If-None-Match` and `X-Request-Id`.

- [ ] **Step 5: Run gateway tests**

Run: `npm test -w apps/api-gateway`

Expected: PASS.

- [ ] **Step 6: Commit gateway**

Run:

```bash
git add apps/api-gateway package-lock.json
git commit -m "feat: add api gateway service"
```

Expected: commit succeeds.

### Task 8: Add Docker Compose VPS Deployment

**Files:**
- Create: `docker-compose.yml`
- Create: `ops/caddy/Caddyfile`
- Create: `.env.example`
- Modify: `apps/api-gateway/package.json`
- Modify: `apps/content-service/package.json`

- [ ] **Step 1: Create Docker-related scripts**

Ensure both Node services have:

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js"
  }
}
```

- [ ] **Step 2: Create Compose file**

Create `docker-compose.yml`:

```yaml
services:
  reverse-proxy:
    image: caddy:2
    ports:
      - "8080:80"
    volumes:
      - ./ops/caddy/Caddyfile:/etc/caddy/Caddyfile:ro
    depends_on:
      - api-gateway

  api-gateway:
    image: node:20-alpine
    working_dir: /app
    command: sh -c "npm ci && npm run build -w apps/api-gateway && npm start -w apps/api-gateway"
    environment:
      API_GATEWAY_PORT: "3000"
      CONTENT_SERVICE_URL: "http://content-service:3001"
      NODE_ENV: "production"
    volumes:
      - ./:/app
    expose:
      - "3000"
    depends_on:
      - content-service

  content-service:
    image: node:20-alpine
    working_dir: /app
    command: sh -c "npm ci && npm run build -w apps/content-service && npm run content:validate -w apps/content-service && npm start -w apps/content-service"
    environment:
      CONTENT_SERVICE_PORT: "3001"
      CONTENT_ROOT: "/app/content/stories"
      NODE_ENV: "production"
    volumes:
      - ./:/app
    expose:
      - "3001"
```

Create `ops/caddy/Caddyfile`:

```text
:80 {
  reverse_proxy api-gateway:3000
}
```

Create `.env.example`:

```text
API_GATEWAY_PORT=3000
CONTENT_SERVICE_URL=http://content-service:3001
CONTENT_SERVICE_PORT=3001
CONTENT_ROOT=/app/content/stories
NODE_ENV=production
```

- [ ] **Step 3: Verify Compose config**

Run: `docker compose config`

Expected: exits 0 and prints normalized config.

- [ ] **Step 4: Commit deployment config**

Run:

```bash
git add docker-compose.yml ops/caddy/Caddyfile .env.example apps/api-gateway/package.json apps/content-service/package.json
git commit -m "chore: add vps docker compose deployment"
```

Expected: commit succeeds.

### Task 9: Scaffold Flutter Android App

**Files:**
- Create: `apps/mobile-reader/`
- Modify: `apps/mobile-reader/pubspec.yaml`
- Modify: `apps/mobile-reader/lib/main.dart`

- [ ] **Step 1: Create Flutter app**

Run:

```bash
mkdir -p apps
flutter create --platforms android apps/mobile-reader
```

Expected: Flutter project exists at `apps/mobile-reader`.

- [ ] **Step 2: Add Flutter dependencies**

Run:

```bash
cd apps/mobile-reader
flutter pub add flutter_riverpod hive hive_flutter http
flutter pub add --dev build_runner flutter_test
```

Expected: dependencies are added to `pubspec.yaml`.

- [ ] **Step 3: Replace starter main**

Create `apps/mobile-reader/lib/main.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  runApp(const ProviderScope(child: ReaderApp()));
}

class ReaderApp extends StatelessWidget {
  const ReaderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Truyen Chu',
      theme: ThemeData(useMaterial3: true),
      home: const Scaffold(
        body: Center(child: Text('Reader platform')),
      ),
    );
  }
}
```

- [ ] **Step 4: Run Flutter analyze**

Run: `cd apps/mobile-reader && flutter analyze`

Expected: no issues.

- [ ] **Step 5: Commit Flutter scaffold**

Run:

```bash
git add apps/mobile-reader
git commit -m "feat: scaffold flutter reader app"
```

Expected: commit succeeds.

### Task 10: Implement Flutter Models, API Client, And Reader Renderer

**Files:**
- Create: `apps/mobile-reader/lib/core/api/reader_api_client.dart`
- Create: `apps/mobile-reader/lib/features/reader/domain/document_ast.dart`
- Create: `apps/mobile-reader/lib/features/reader/presentation/widgets/ast_block_renderer.dart`
- Test: `apps/mobile-reader/test/ast_block_renderer_test.dart`

- [ ] **Step 1: Write renderer widget test**

Create `apps/mobile-reader/test/ast_block_renderer_test.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_reader/features/reader/domain/document_ast.dart';
import 'package:mobile_reader/features/reader/presentation/widgets/ast_block_renderer.dart';

void main() {
  testWidgets('renders heading and paragraph blocks', (tester) async {
    final blocks = [
      DocumentBlock.heading(
        id: 'b0001',
        level: 1,
        text: 'Chương 1',
      ),
      DocumentBlock.paragraph(
        id: 'b0002',
        text: 'Nội dung chương.',
      ),
    ];

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: AstBlockRenderer(blocks: blocks),
        ),
      ),
    );

    expect(find.text('Chương 1'), findsOneWidget);
    expect(find.text('Nội dung chương.'), findsOneWidget);
  });
}
```

- [ ] **Step 2: Run failing Flutter test**

Run: `cd apps/mobile-reader && flutter test test/ast_block_renderer_test.dart`

Expected: FAIL because domain and widget files do not exist.

- [ ] **Step 3: Implement minimal Document AST model**

Create `apps/mobile-reader/lib/features/reader/domain/document_ast.dart`:

```dart
sealed class DocumentBlock {
  const DocumentBlock({required this.id});

  final String id;

  factory DocumentBlock.heading({
    required String id,
    required int level,
    required String text,
  }) = HeadingBlock;

  factory DocumentBlock.paragraph({
    required String id,
    required String text,
  }) = ParagraphBlock;
}

class HeadingBlock extends DocumentBlock {
  const HeadingBlock({
    required super.id,
    required this.level,
    required this.text,
  });

  final int level;
  final String text;
}

class ParagraphBlock extends DocumentBlock {
  const ParagraphBlock({
    required super.id,
    required this.text,
  });

  final String text;
}
```

Create `apps/mobile-reader/lib/features/reader/presentation/widgets/ast_block_renderer.dart`:

```dart
import 'package:flutter/material.dart';
import '../../domain/document_ast.dart';

class AstBlockRenderer extends StatelessWidget {
  const AstBlockRenderer({required this.blocks, super.key});

  final List<DocumentBlock> blocks;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: blocks.length,
      itemBuilder: (context, index) {
        final block = blocks[index];
        return switch (block) {
          HeadingBlock(:final text) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Text(text, style: Theme.of(context).textTheme.headlineMedium),
            ),
          ParagraphBlock(:final text) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Text(text, style: Theme.of(context).textTheme.bodyLarge),
            ),
        };
      },
    );
  }
}
```

- [ ] **Step 4: Run Flutter test**

Run: `cd apps/mobile-reader && flutter test test/ast_block_renderer_test.dart`

Expected: PASS.

- [ ] **Step 5: Commit renderer**

Run:

```bash
git add apps/mobile-reader
git commit -m "feat: render document ast in flutter"
```

Expected: commit succeeds.

### Task 11: Implement Mobile Screens And Local Progress

**Files:**
- Create: `apps/mobile-reader/lib/features/library/presentation/library_screen.dart`
- Create: `apps/mobile-reader/lib/features/story_detail/presentation/story_detail_screen.dart`
- Create: `apps/mobile-reader/lib/features/reader/presentation/reader_screen.dart`
- Create: `apps/mobile-reader/lib/features/settings/presentation/settings_screen.dart`
- Create: `apps/mobile-reader/lib/core/storage/reading_progress_store.dart`
- Modify: `apps/mobile-reader/lib/main.dart`
- Test: `apps/mobile-reader/test/reading_progress_store_test.dart`

- [ ] **Step 1: Write progress store test**

Create `apps/mobile-reader/test/reading_progress_store_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_reader/core/storage/reading_progress_store.dart';

void main() {
  test('stores and retrieves reading progress by story slug', () async {
    final store = InMemoryReadingProgressStore();

    await store.save(
      const ReadingProgress(
        storySlug: 'mua-tren-ben-khong-den',
        chapterSlug: 'chuong-01-xac-duoi-mai-hien',
        scrollOffset: 120,
      ),
    );

    final progress = await store.get('mua-tren-ben-khong-den');

    expect(progress?.chapterSlug, 'chuong-01-xac-duoi-mai-hien');
    expect(progress?.scrollOffset, 120);
  });
}
```

- [ ] **Step 2: Implement progress store**

Create `apps/mobile-reader/lib/core/storage/reading_progress_store.dart`:

```dart
class ReadingProgress {
  const ReadingProgress({
    required this.storySlug,
    required this.chapterSlug,
    required this.scrollOffset,
  });

  final String storySlug;
  final String chapterSlug;
  final double scrollOffset;
}

abstract class ReadingProgressStore {
  Future<void> save(ReadingProgress progress);
  Future<ReadingProgress?> get(String storySlug);
}

class InMemoryReadingProgressStore implements ReadingProgressStore {
  final Map<String, ReadingProgress> _items = {};

  @override
  Future<void> save(ReadingProgress progress) async {
    _items[progress.storySlug] = progress;
  }

  @override
  Future<ReadingProgress?> get(String storySlug) async {
    return _items[storySlug];
  }
}
```

- [ ] **Step 3: Run progress test**

Run: `cd apps/mobile-reader && flutter test test/reading_progress_store_test.dart`

Expected: PASS.

- [ ] **Step 4: Implement screens**

Implement screens with these minimum responsibilities:

```text
LibraryScreen: shows fetched stories and opens StoryDetailScreen.
StoryDetailScreen: shows metadata and chapter list.
ReaderScreen: fetches chapter document and renders AST.
SettingsScreen: edits server base URL, theme, font size, line height.
```

The first integration version may use static sample data until API client wiring is completed in the same task. Remove static sample data before commit by pointing LibraryScreen at `ReaderApiClient`.

- [ ] **Step 5: Run Flutter tests and analyze**

Run:

```bash
cd apps/mobile-reader
flutter test
flutter analyze
```

Expected: both commands pass.

- [ ] **Step 6: Commit mobile screens**

Run:

```bash
git add apps/mobile-reader
git commit -m "feat: add mobile reader screens and progress"
```

Expected: commit succeeds.

### Task 12: End-To-End Verification

**Files:**
- Create or modify: `README.md`
- Verify: all services and app

- [ ] **Step 1: Run Node tests**

Run: `npm test`

Expected: all workspace tests pass.

- [ ] **Step 2: Validate content**

Run: `npm run content:validate`

Expected: validation passes for all stories and chapters.

- [ ] **Step 3: Run Docker Compose config check**

Run: `docker compose config`

Expected: exits 0.

- [ ] **Step 4: Run Flutter verification**

Run:

```bash
cd apps/mobile-reader
flutter test
flutter analyze
```

Expected: tests and analysis pass.

- [ ] **Step 5: Run local API smoke check**

Start services:

```bash
docker compose up --build
```

In another shell:

```bash
curl -s http://localhost:8080/api/v1/stories
curl -s http://localhost:8080/api/v1/stories/mua-tren-ben-khong-den/chapters
curl -s http://localhost:8080/api/v1/stories/mua-tren-ben-khong-den/chapters/chuong-01-xac-duoi-mai-hien
```

Expected:

- First response contains `"mua-tren-ben-khong-den"`.
- Second response contains 24 chapters.
- Third response contains `"document":{"version":1`.

- [ ] **Step 6: Write runbook and commit final docs**

Create or update `README.md` with this content:

````markdown
# Truyen Chu Reader Platform

## Development

Install Node dependencies:

```bash
npm install
```

Validate story content:

```bash
npm run content:validate
```

Run Node tests:

```bash
npm test
```

Run the VPS-style stack locally:

```bash
docker compose up --build
```

Public API entrypoint:

```text
http://localhost:8080/api/v1
```

Useful smoke checks:

```bash
curl -s http://localhost:8080/api/v1/stories
curl -s http://localhost:8080/api/v1/stories/mua-tren-ben-khong-den/chapters
curl -s http://localhost:8080/api/v1/stories/mua-tren-ben-khong-den/chapters/chuong-01-xac-duoi-mai-hien
```

Run Flutter checks:

```bash
cd apps/mobile-reader
flutter test
flutter analyze
```
````

Run:

```bash
git add README.md
git commit -m "docs: add reader platform runbook"
```

Expected: commit succeeds.
