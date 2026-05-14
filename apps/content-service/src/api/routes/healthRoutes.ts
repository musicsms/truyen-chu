import { FastifyInstance } from "fastify";
import { ContentIndex } from "../../application/contentIndex.js";

export async function registerHealthRoutes(app: FastifyInstance, index: ContentIndex) {
  app.get("/internal/v1/health", async () => ({
    ok: true,
    storyCount: index.stories.size
  }));
}
