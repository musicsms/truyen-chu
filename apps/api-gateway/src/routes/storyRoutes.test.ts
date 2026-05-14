import { describe, expect, it } from "vitest";
import { buildApiGatewayApp } from "../app.js";

describe("api gateway story routes", () => {
  it("forwards story list requests and propagates request id", async () => {
    const app = await buildApiGatewayApp({
      contentServiceUrl: "mock://content",
      fetchImpl: async (_url, init) => {
        expect(init?.headers).toMatchObject({ "X-Request-Id": "req-test" });
        return new Response(JSON.stringify({ stories: [] }), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/stories",
      headers: { "x-request-id": "req-test" }
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-request-id"]).toBe("req-test");
    expect(response.json()).toEqual({ stories: [] });
  });
});
