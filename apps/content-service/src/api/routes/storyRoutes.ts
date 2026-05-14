import { FastifyInstance } from "fastify";
import {
  ContentIndex,
  getStoryRecord,
  listStorySummaries
} from "../../application/contentIndex.js";
import { sendNotFound } from "../errors.js";
import { weakEtag } from "../etag.js";

export async function registerStoryRoutes(app: FastifyInstance, index: ContentIndex) {
  app.get("/internal/v1/stories", async (_request, reply) => {
    const body = { stories: listStorySummaries(index) };
    reply.header("ETag", weakEtag(body));
    return body;
  });

  app.get<{ Params: { storySlug: string } }>("/internal/v1/stories/:storySlug", async (request, reply) => {
    const record = getStoryRecord(index, request.params.storySlug);
    if (!record) {
      return sendNotFound(reply, "STORY_NOT_FOUND", "Story not found", request.params);
    }

    const metadata = record.metadata;
    const body = {
      slug: metadata.slug,
      title: metadata.title,
      author: metadata.author,
      description: metadata.description,
      status: metadata.status,
      language: metadata.language,
      tags: metadata.tags,
      coverUrl: metadata.cover === null ? null : `/api/v1/stories/${metadata.slug}/cover`,
      chapterCount: metadata.chapters.length,
      updatedAt: null
    };
    reply.header("ETag", weakEtag(body));
    return body;
  });
}
