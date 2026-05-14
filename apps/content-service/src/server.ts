import { buildContentServiceApp } from "./app.js";

const port = Number(process.env.CONTENT_SERVICE_PORT ?? "3001");
const host = process.env.HOST ?? "0.0.0.0";
const contentRoot = process.env.CONTENT_ROOT ?? "content/stories";

const app = await buildContentServiceApp({ contentRoot });
await app.listen({ port, host });
