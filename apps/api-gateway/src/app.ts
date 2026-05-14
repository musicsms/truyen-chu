import crypto from "node:crypto";
import Fastify from "fastify";
import { registerChapterRoutes } from "./routes/chapterRoutes.js";
import { registerHealthRoutes } from "./routes/healthRoutes.js";
import { registerStoryRoutes } from "./routes/storyRoutes.js";

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
