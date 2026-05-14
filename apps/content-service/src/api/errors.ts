import { FastifyReply } from "fastify";

export function sendNotFound(reply: FastifyReply, code: string, message: string, details: Record<string, unknown>) {
  return reply.status(404).send({
    error: {
      code,
      message,
      details
    }
  });
}
