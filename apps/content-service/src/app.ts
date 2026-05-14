import Fastify from "fastify";
import { buildContentIndex } from "./application/contentIndex.js";
import { registerChapterRoutes } from "./api/routes/chapterRoutes.js";
import { registerHealthRoutes } from "./api/routes/healthRoutes.js";
import { registerStoryRoutes } from "./api/routes/storyRoutes.js";

export async function buildContentServiceApp(options: { contentRoot: string }) {
  const app = Fastify({ logger: false });
  const index = await buildContentIndex(options.contentRoot);

  await registerHealthRoutes(app, index);
  await registerStoryRoutes(app, index);
  await registerChapterRoutes(app, index);

  return app;
}
