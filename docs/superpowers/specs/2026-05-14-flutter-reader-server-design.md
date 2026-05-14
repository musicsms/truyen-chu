# Thiết kế hệ thống đọc truyện Flutter + server

Ngày: 2026-05-14

## Mục tiêu

Xây dựng một hệ thống đọc truyện gồm server read-only và mobile client Android bằng Flutter.

Server chuẩn hóa kho truyện lưu bằng Markdown thành API ổn định. Flutter client đọc dữ liệu từ server, hiển thị thư viện truyện, danh sách chương, màn đọc native, và lưu tiến độ đọc cục bộ.

V1 ưu tiên Android trước. iOS có thể hỗ trợ sau vì Flutter dùng chung phần lớn code client, nhưng mọi kiểm thử và tiêu chí hoàn thành của V1 tập trung vào Android.

## Phạm vi V1

V1 gồm ba phần:

1. Kho nội dung chuẩn hóa theo thư mục truyện.
2. Server `Node.js + Fastify + TypeScript` cung cấp API read-only.
3. Flutter Android app đọc truyện từ server.

V1 không gồm:

- Đăng nhập, tài khoản, đồng bộ cloud.
- Admin UI để upload/sửa truyện.
- Ghi dữ liệu từ client lên server.
- Bình luận, rating, bookmark cloud.
- Search toàn văn nâng cao.
- iOS release.

## Quyết định kiến trúc chính

Markdown là định dạng lưu trữ và source of truth. Mỗi chương là một file Markdown riêng.

API chính không trả Markdown gốc làm payload đọc. Server parse Markdown thành structured document AST, sau đó Flutter render AST bằng native widgets.

Lý do chọn AST:

- Reader mobile kiểm soát tốt hơn font, khoảng cách dòng, theme, spacing và navigation.
- API có schema rõ, dễ validate và version.
- Sau này có thể thêm highlight, annotation, search index, analytics hoặc audio alignment dựa trên block id.
- Markdown vẫn giữ được tính portable, dễ diff, dễ sửa bằng editor thường.

Server vẫn có endpoint trả Markdown source để debug/export trong môi trường dev hoặc khi cần kiểm tra content.

## Cấu trúc repository đề xuất

```text
content/
  stories/
    mua-tren-ben-khong-den/
      metadata.json
      cover.jpg
      chapters/
        chuong-01-xac-duoi-mai-hien.md
        chuong-02-nguoi-va-luoi-rut-kiem.md

apps/
  server/
    package.json
    tsconfig.json
    src/

  mobile_reader/
    pubspec.yaml
    lib/
```

Truyện hiện tại `Mưa Trên Bến Không Đèn` sẽ được chuyển từ `docs/kiem-hiep/manuscript/final/` sang `content/stories/mua-tren-ben-khong-den/chapters/` trong giai đoạn implementation. File docs hiện tại vẫn có thể giữ làm bản thảo/tài liệu nguồn.

## Content Model

Mỗi truyện là một folder theo slug:

```text
content/stories/<storySlug>/
  metadata.json
  cover.jpg
  chapters/
    <chapterSlug>.md
```

`metadata.json` V1:

```json
{
  "slug": "mua-tren-ben-khong-den",
  "title": "Mưa Trên Bến Không Đèn",
  "author": "Local",
  "description": "Một truyện kiếm hiệp trinh thám/noir về oan án, hồ sơ bị sửa, và cái giá của công lý.",
  "status": "completed",
  "language": "vi",
  "tags": ["kiem-hiep", "noir", "trinh-tham"],
  "cover": "cover.jpg",
  "chapters": [
    {
      "slug": "chuong-01-xac-duoi-mai-hien",
      "title": "Chương 1: Xác dưới mái hiên",
      "order": 1,
      "file": "chapters/chuong-01-xac-duoi-mai-hien.md"
    }
  ]
}
```

Required fields:

- Story: `slug`, `title`, `author`, `description`, `status`, `language`, `tags`, `chapters`.
- Chapter: `slug`, `title`, `order`, `file`.

Slug chỉ dùng chữ thường ASCII, số, và dấu gạch ngang. `order` phải là số nguyên dương, không trùng trong cùng truyện. `file` phải nằm trong folder truyện, không được trỏ ra ngoài bằng path traversal.

## Document AST V1

Chapter API trả document AST:

```json
{
  "storySlug": "mua-tren-ben-khong-den",
  "chapterSlug": "chuong-01-xac-duoi-mai-hien",
  "title": "Chương 1: Xác dưới mái hiên",
  "order": 1,
  "sourceFormat": "markdown",
  "wordCount": 2386,
  "checksum": "sha256...",
  "document": {
    "version": 1,
    "blocks": [
      {
        "id": "b0001",
        "type": "heading",
        "level": 1,
        "children": [
          { "type": "text", "text": "Chương 1: Xác dưới mái hiên" }
        ]
      },
      {
        "id": "b0002",
        "type": "paragraph",
        "children": [
          { "type": "text", "text": "Mưa rơi từ giờ Tuất..." }
        ]
      }
    ]
  }
}
```

Supported block types V1:

- `heading`
- `paragraph`
- `blockquote`
- `divider`

Supported inline nodes V1:

- `text`
- `strong`
- `emphasis`

Unsupported Markdown constructs fail content validation unless explicitly ignored by parser rules. V1 does not support tables, code blocks, footnotes, raw HTML, embedded images inside chapter body, or custom directives.

Block ids are deterministic within one parsed chapter, based on block order. They support future features such as reading position, highlight, annotation, and text-to-speech alignment.

## Server Design

Server lives in `apps/server`, using `Node.js + Fastify + TypeScript`.

Proposed module layout:

```text
apps/server/src/
  config/
    env.ts

  content/
    contentPaths.ts
    contentScanner.ts
    metadataSchema.ts
    markdownParser.ts
    contentIndex.ts
    contentValidator.ts

  api/
    routes/
      healthRoutes.ts
      storyRoutes.ts
      chapterRoutes.ts
    errorResponse.ts
    etag.ts

  app.ts
  server.ts
```

Startup behavior:

1. Read `CONTENT_ROOT`.
2. Scan `content/stories/*`.
3. Validate every `metadata.json`.
4. Validate all declared chapter files exist.
5. Validate unique slugs and chapter order.
6. Build in-memory story/chapter index.
7. Start Fastify server.

Chapter parsing should be lazy on request, then cached in memory using file mtime/checksum. This keeps startup fast while still allowing strict content validation through `npm run content:validate`.

## API Contract V1

Route prefix: `/api/v1`.

```text
GET /api/v1/health
GET /api/v1/stories
GET /api/v1/stories/:storySlug
GET /api/v1/stories/:storySlug/chapters
GET /api/v1/stories/:storySlug/chapters/:chapterSlug
GET /api/v1/stories/:storySlug/chapters/:chapterSlug/source
GET /api/v1/stories/:storySlug/cover
```

Endpoint behavior:

- `/health`: returns server status and content index status.
- `/stories`: returns lightweight story cards.
- `/stories/:storySlug`: returns full story metadata.
- `/chapters`: returns ordered chapter list without chapter body.
- `/chapters/:chapterSlug`: returns parsed AST response.
- `/source`: returns raw Markdown source for debug/export.
- `/cover`: returns cover asset if present.

Standard error response:

```json
{
  "error": {
    "code": "CHAPTER_NOT_FOUND",
    "message": "Chapter not found",
    "details": {
      "storySlug": "mua-tren-ben-khong-den",
      "chapterSlug": "chuong-99"
    }
  }
}
```

Caching:

- Story and chapter responses include `ETag`.
- Client can send `If-None-Match`.
- Server returns `304` when content is unchanged.
- Flutter cache keys use `storySlug + chapterSlug + etag`.

## Flutter Android Client Design

Flutter app lives in `apps/mobile_reader`.

Main screens:

1. Library
2. Story Detail
3. Reader
4. Settings

Library:

- Fetches `GET /api/v1/stories`.
- Shows title, author, cover, short description, status, chapter count.
- Supports manual refresh.

Story Detail:

- Fetches full story metadata.
- Fetches ordered chapter list.
- Shows read/resume action when local progress exists.

Reader:

- Fetches AST from chapter endpoint.
- Renders blocks using native Flutter widgets.
- Supports previous/next chapter.
- Saves local progress.
- Supports light, sepia, and dark themes.
- Supports font size and line height controls.

Settings:

- Server base URL.
- Theme.
- Font size.
- Line height.

Local persistence:

- `shared_preferences` for simple settings.
- Hive for story/chapter cache and reading progress.

Flutter models should mirror API contracts:

- `StorySummary`
- `StoryDetail`
- `ChapterSummary`
- `ChapterDocument`
- `DocumentBlock`
- `InlineNode`
- `ReaderSettings`
- `ReadingProgress`

## Data Flow

```text
Markdown files
  -> server content scanner
  -> metadata validation
  -> in-memory index
  -> lazy Markdown parse to AST
  -> REST API with ETag
  -> Flutter API client
  -> local cache
  -> native reader widgets
```

The mobile app never writes to server in V1. Reading progress and settings are local-only.

## Validation

Server provides:

```bash
npm run content:validate
```

Validation fails if:

- A story is missing required metadata fields.
- Story slug or chapter slug is invalid.
- Two stories share a slug.
- Two chapters in one story share a slug or order.
- A declared chapter file is missing.
- A chapter file path escapes the story folder.
- Markdown parses to an empty AST.
- Markdown contains unsupported constructs that V1 cannot represent.

The parser should report actionable errors with story slug, chapter slug, file path, and reason.

## Testing

Server tests:

- Metadata schema validation.
- Content scanner behavior with valid and invalid fixtures.
- Markdown-to-AST parser snapshots.
- API route tests for story list, story detail, chapter list, chapter document, source, and 404.
- ETag and `304` behavior.

Flutter tests:

- API model JSON parsing.
- AST renderer widget tests for `heading`, `paragraph`, `blockquote`, and `divider`.
- Reader settings persistence.
- Reading progress persistence.
- API client behavior using mocked responses.

## Implementation Milestones

1. Create `content/stories` structure and migrate `Mưa Trên Bến Không Đèn`.
2. Scaffold `apps/server`.
3. Implement metadata schema, scanner, validator, and content index.
4. Implement Markdown-to-AST parser.
5. Implement Fastify routes and tests.
6. Scaffold `apps/mobile_reader`.
7. Implement API client and models.
8. Implement Library, Story Detail, Reader, and Settings screens.
9. Implement cache/progress/settings persistence.
10. Run server validation, server tests, Flutter tests, and Android smoke test.

## Completion Criteria

V1 is complete when:

- Server starts from `apps/server`.
- `npm run content:validate` passes.
- Existing story appears through `GET /api/v1/stories`.
- Chapter API returns AST for all 24 chapters.
- Flutter Android app lists the story, opens chapter list, reads chapters, changes theme/font settings, and navigates previous/next chapter.
- Reading progress persists after app restart.
- Basic server and Flutter tests pass.

