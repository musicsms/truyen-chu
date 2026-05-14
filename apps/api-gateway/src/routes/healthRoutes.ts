import { FastifyInstance } from "fastify";

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get("/api/v1/health", async () => ({
    ok: true
  }));
}
