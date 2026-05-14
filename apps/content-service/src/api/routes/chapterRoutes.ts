import { FastifyInstance } from "fastify";
import {
  ContentIndex,
  getChapterDocument,
  getChapterSource,
  getStoryRecord,
  listChapterSummaries
} from "../../application/contentIndex.js";
import { sendNotFound } from "../errors.js";
import { weakEtag } from "../etag.js";

export async function registerChapterRoutes(app: FastifyInstance, index: ContentIndex) {
  app.get<{ Params: { storySlug: string } }>("/internal/v1/stories/:storySlug/chapters", async (request, reply) => {
    const record = getStoryRecord(index, request.params.storySlug);
    if (!record) {
      return sendNotFound(reply, "STORY_NOT_FOUND", "Story not found", request.params);
    }

    const body = { chapters: listChapterSummaries(record) };
    reply.header("ETag", weakEtag(body));
    return body;
  });

  app.get<{ Params: { storySlug: string; chapterSlug: string } }>(
    "/internal/v1/stories/:storySlug/chapters/:chapterSlug",
    async (request, reply) => {
      const record = getStoryRecord(index, request.params.storySlug);
      if (!record) {
        return sendNotFound(reply, "STORY_NOT_FOUND", "Story not found", request.params);
      }

      const body = await getChapterDocument(record, request.params.chapterSlug);
      if (!body) {
        return sendNotFound(reply, "CHAPTER_NOT_FOUND", "Chapter not found", request.params);
      }

      const etag = weakEtag(body);
      reply.header("ETag", etag);
      if (request.headers["if-none-match"] === etag) {
        return reply.status(304).send();
      }
      return body;
    }
  );

  app.get<{ Params: { storySlug: string; chapterSlug: string } }>(
    "/internal/v1/stories/:storySlug/chapters/:chapterSlug/source",
    async (request, reply) => {
      const record = getStoryRecord(index, request.params.storySlug);
      if (!record) {
        return sendNotFound(reply, "STORY_NOT_FOUND", "Story not found", request.params);
      }

      const source = await getChapterSource(record, request.params.chapterSlug);
      if (source === null) {
        return sendNotFound(reply, "CHAPTER_NOT_FOUND", "Chapter not found", request.params);
      }

      reply.type("text/markdown; charset=utf-8");
      reply.header("ETag", weakEtag(source));
      return source;
    }
  );
}
