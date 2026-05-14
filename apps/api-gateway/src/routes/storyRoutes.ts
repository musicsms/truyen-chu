import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ContentClientOptions, forwardToContentService } from "../clients/contentClient.js";

function forwardedHeaders(request: FastifyRequest): Record<string, string> {
  const requestId = request.headers["x-request-id"];
  const headers: Record<string, string> = {
    "X-Request-Id": Array.isArray(requestId) ? requestId[0] : String(requestId)
  };
  const ifNoneMatch = request.headers["if-none-match"];
  if (ifNoneMatch) {
    headers["If-None-Match"] = Array.isArray(ifNoneMatch) ? ifNoneMatch[0] : ifNoneMatch;
  }
  return headers;
}

async function proxyJson(request: FastifyRequest, reply: FastifyReply, options: ContentClientOptions, path: string) {
  const response = await forwardToContentService(options, path, forwardedHeaders(request));
  const etag = response.headers.get("etag");
  if (etag) reply.header("ETag", etag);
  if (response.status === 304) return reply.status(304).send();

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();
  return reply.status(response.status).send(body);
}

export async function registerStoryRoutes(app: FastifyInstance, options: ContentClientOptions) {
  app.get("/api/v1/stories", async (request, reply) => {
    return proxyJson(request, reply, options, "/internal/v1/stories");
  });

  app.get<{ Params: { storySlug: string } }>("/api/v1/stories/:storySlug", async (request, reply) => {
    return proxyJson(request, reply, options, `/internal/v1/stories/${request.params.storySlug}`);
  });
}
