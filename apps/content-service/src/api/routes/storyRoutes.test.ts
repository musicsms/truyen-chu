import { describe, expect, it } from "vitest";
import { buildContentServiceApp } from "../../app.js";

describe("content service routes", () => {
  it("lists stories from the real content root", async () => {
    const app = await buildContentServiceApp({ contentRoot: "content/stories" });
    const response = await app.inject({ method: "GET", url: "/internal/v1/stories" });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.stories[0].slug).toBe("mua-tren-ben-khong-den");
    expect(body.stories[0].chapterCount).toBe(24);
  });
});
