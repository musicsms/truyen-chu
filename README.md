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
flutter build apk --debug
```
