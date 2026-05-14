# Kiến trúc microservices cho hệ thống đọc truyện

Ngày: 2026-05-14

## Mục tiêu

Thiết kế kiến trúc best-practice cho hệ thống đọc truyện gồm Flutter Android client, API Gateway, Content Service read-only, shared contracts, và kho truyện Markdown.

Quyết định chính: V1 dùng microservices ngay từ đầu, nhưng chỉ tách những boundary đã có lý do rõ ràng. Không tạo user, progress, search, admin service khi các năng lực đó chưa nằm trong phạm vi V1.

## Phạm vi V1

V1 gồm:

1. `apps/api-gateway`: public API entrypoint cho mobile.
2. `apps/content-service`: service read-only xử lý truyện Markdown, metadata, validation, AST.
3. `apps/mobile-reader`: Flutter Android app.
4. `packages/contracts`: DTO/schema dùng chung giữa gateway, content service, và client tooling.
5. `content/stories`: kho truyện theo folder slug.
6. Docker Compose để chạy trên VPS.

V1 không gồm:

- Auth/user account.
- Cloud reading progress sync.
- Admin CMS.
- Full-text search service.
- Message queue/event bus.
- Kubernetes.
- Multi-region deploy.

## Kiến trúc tổng thể

```text
Flutter Android
  -> HTTPS
  -> Nginx/Caddy reverse proxy
  -> API Gateway
  -> internal HTTP
  -> Content Service
  -> content/stories
```

Public traffic chỉ đi qua reverse proxy và API Gateway. Content Service không expose port public.

## Monorepo layout

```text
apps/
  api-gateway/
    package.json
    Dockerfile
    src/
      config/
      clients/
        contentClient.ts
      middleware/
        requestId.ts
        errorHandler.ts
      routes/
        healthRoutes.ts
        storyRoutes.ts
        chapterRoutes.ts
      app.ts
      server.ts

  content-service/
    package.json
    Dockerfile
    src/
      config/
      domain/
        entities/
        schemas/
        services/
      application/
        useCases/
      infrastructure/
        contentStore/
        parser/
        cache/
        checksum/
      api/
        routes/
        mappers/
        errors/
      app.ts
      server.ts

  mobile-reader/
    pubspec.yaml
    lib/
      core/
      features/

packages/
  contracts/
    package.json
    src/
      story.dto.ts
      chapter.dto.ts
      document-ast.dto.ts
      error.dto.ts

content/
  stories/
    <story-slug>/
      metadata.json
      cover.jpg
      chapters/
        <chapter-slug>.md
```

## Service responsibilities

### API Gateway

Gateway là public backend duy nhất cho mobile.

Responsibilities:

- Expose `/api/v1`.
- Forward story/chapter requests to Content Service.
- Normalize public API responses.
- Attach and propagate `requestId`.
- Handle CORS if needed for web/debug clients.
- Apply request logging.
- Apply light rate limiting.
- Return stable error contract.
- Hide internal service topology from mobile client.

Gateway does not:

- Read Markdown files directly.
- Parse Markdown.
- Know content folder structure.
- Store reading progress in V1.
- Implement auth in V1.

### Content Service

Content Service owns the content domain.

Responsibilities:

- Read `content/stories`.
- Validate `metadata.json`.
- Validate chapter file existence and order.
- Parse Markdown into Document AST.
- Compute checksums and ETags.
- Cache parsed chapter documents.
- Expose internal read-only API to Gateway.
- Provide content validation command for CI/deploy.

Content Service does not:

- Expose public internet port.
- Know mobile UI details.
- Store user-specific progress.
- Accept writes or uploads in V1.

### Flutter Mobile Reader

Flutter app only talks to API Gateway.

Responsibilities:

- Display story library.
- Display story detail and chapter list.
- Render Document AST with native Flutter widgets.
- Cache story/chapter data locally.
- Store local reading progress and reader settings.
- Allow configuring server base URL for development/testing.

Mobile app does not:

- Call Content Service directly.
- Parse Markdown source in V1 reading flow.
- Depend on filesystem content layout.

### Contracts package

`packages/contracts` defines stable DTOs and schemas.

Responsibilities:

- Story summary/detail DTOs.
- Chapter summary/document DTOs.
- Document AST schema.
- Error response schema.
- Shared enums such as story status, document version, block types.

Contracts should be versioned and conservative. Breaking changes require new API version or explicit migration.

## API boundaries

### Public API

Public API is exposed by Gateway:

```text
GET /api/v1/health
GET /api/v1/stories
GET /api/v1/stories/:storySlug
GET /api/v1/stories/:storySlug/chapters
GET /api/v1/stories/:storySlug/chapters/:chapterSlug
GET /api/v1/stories/:storySlug/chapters/:chapterSlug/source
GET /api/v1/stories/:storySlug/cover
```

The mobile app treats Gateway as the only backend.

### Internal API

Internal API is exposed by Content Service only on the Docker/VPS private network:

```text
GET /internal/v1/health
GET /internal/v1/stories
GET /internal/v1/stories/:storySlug
GET /internal/v1/stories/:storySlug/chapters
GET /internal/v1/stories/:storySlug/chapters/:chapterSlug
GET /internal/v1/stories/:storySlug/chapters/:chapterSlug/source
GET /internal/v1/stories/:storySlug/cover
```

Gateway maps public routes to internal routes. For V1 the mapping can be mostly pass-through, but the boundary remains useful because auth, throttling, analytics, and client-specific shaping can be added later without changing Content Service.

## Document format

Markdown remains source of truth. Document AST remains API contract.

Supported block types V1:

- `heading`
- `paragraph`
- `blockquote`
- `divider`

Supported inline nodes V1:

- `text`
- `strong`
- `emphasis`

Chapter document response:

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
      }
    ]
  }
}
```

## Error contract

All services use the same error shape:

```json
{
  "error": {
    "code": "CHAPTER_NOT_FOUND",
    "message": "Chapter not found",
    "details": {
      "storySlug": "mua-tren-ben-khong-den",
      "chapterSlug": "chuong-99"
    },
    "requestId": "req_..."
  }
}
```

Gateway should preserve Content Service error codes where they are safe for clients. Internal details such as file paths should not be returned through public API unless running in development mode.

## Request tracing

Every incoming Gateway request receives a `requestId`.

Rules:

- Gateway accepts `X-Request-Id` from trusted/dev clients or generates one.
- Gateway forwards `X-Request-Id` to Content Service.
- Content Service includes the same id in logs and errors.
- Logs should include method, path, status, duration, and request id.

This is enough for VPS debugging without introducing distributed tracing infrastructure.

## Caching

Content Service owns content checksums and ETags.

Rules:

- Story/chapter responses include `ETag`.
- Gateway forwards client `If-None-Match` to Content Service.
- Gateway preserves `304 Not Modified`.
- Flutter caches responses by `storySlug`, `chapterSlug`, and `etag`.
- Cover assets can use longer cache headers because filenames are controlled by metadata.

V1 can use in-memory cache inside Content Service. Persistent distributed cache is not needed until there are multiple content-service replicas or very large content.

## Validation and CI

Content validation is mandatory.

Content Service provides:

```bash
npm run content:validate
```

Validation fails if:

- Story metadata is missing required fields.
- Story/chapter slug is invalid.
- Story slug is duplicated.
- Chapter slug or order is duplicated within a story.
- Declared chapter file is missing.
- Chapter file path escapes the story folder.
- Markdown parses to empty AST.
- Markdown contains unsupported constructs for V1.

Gateway tests should not validate content files directly. Gateway tests mock Content Service responses and verify routing, error mapping, request id propagation, and caching behavior.

## Deployment on VPS

V1 deployment uses Docker Compose.

```text
docker-compose.yml
  reverse-proxy
  api-gateway
  content-service
```

Recommended network:

```text
public internet
  -> reverse-proxy:80/443
  -> api-gateway:3000 internal
  -> content-service:3001 internal
```

Only reverse proxy ports are public. Gateway and Content Service ports are Docker-network internal.

Environment variables:

```text
API_GATEWAY_PORT=3000
CONTENT_SERVICE_URL=http://content-service:3001
CONTENT_SERVICE_PORT=3001
CONTENT_ROOT=/app/content/stories
NODE_ENV=production
```

Production checklist:

- Reverse proxy terminates TLS.
- Content Service has no public port binding.
- Health checks enabled for both backend services.
- Content validation runs before deploy or container start.
- Logs are written to stdout/stderr for Docker collection.

## Future services

The architecture leaves room for these services later:

- `user-service`: account, auth, device sessions.
- `progress-service`: cloud reading progress sync.
- `search-service`: full-text index across stories/chapters.
- `admin-service`: content upload, metadata editing, publish workflow.

Do not create these services in V1. Add them only when there is a real feature requiring independent ownership, persistence, scale, or deployment lifecycle.

## Testing strategy

Content Service:

- Metadata schema tests.
- Content scanner tests.
- Parser snapshot tests.
- Use case tests.
- Internal route tests.
- ETag and `304` tests.
- Content validation fixture tests.

API Gateway:

- Route forwarding tests.
- Request id propagation tests.
- Error mapping tests.
- Cache header pass-through tests.
- Health route tests.

Contracts:

- Schema validation tests.
- Backward-compatible fixture tests for public DTOs.

Flutter:

- DTO parsing tests.
- API client tests with mocked Gateway.
- AST renderer widget tests.
- Reader settings persistence tests.
- Reading progress persistence tests.

## Implementation order

1. Create `packages/contracts`.
2. Create `content/stories` and migrate `Mưa Trên Bến Không Đèn`.
3. Create `apps/content-service`.
4. Implement content validation, scanner, parser, and internal API.
5. Create `apps/api-gateway`.
6. Implement Gateway pass-through routes, request id, error mapping, and health checks.
7. Add Docker Compose and local env examples.
8. Create `apps/mobile-reader`.
9. Implement Flutter API client and screens.
10. Add tests and Android smoke test.

## Completion criteria

V1 architecture is complete when:

- Docker Compose starts reverse proxy, Gateway, and Content Service.
- Gateway public API returns story/chapter data through Content Service.
- Content Service validates and parses all chapters in `content/stories`.
- Content Service is not publicly exposed.
- Request id propagates from Gateway to Content Service.
- ETag/304 works through Gateway.
- Flutter Android app calls Gateway only.
- Basic tests pass for contracts, Content Service, Gateway, and Flutter client.

