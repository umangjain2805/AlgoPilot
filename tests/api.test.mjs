import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";

process.env.API_RATE_LIMIT = "8";
const { default: app } = await import("../server/app.js");

test("API validates bodies, rejects session-cookie writes and rate-limits both sync routes", async () => {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (path, body) =>
    fetch(base + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  try {
    assert.equal(
      (await post("/api/leetcode/fetch", { username: 42 })).status,
      400,
    );
    assert.equal(
      (
        await fetch(base + "/api/leetcode/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{bad",
        })
      ).status,
      400,
    );
    for (const path of ["/sync-leetcode", "/api/sync-leetcode"]) {
      assert.equal(
        (
          await post(path, {
            username: "someone",
            sessionCookie: "do-not-accept",
          })
        ).status,
        400,
      );
    }
    for (let i = 0; i < 10; i++) {
      const response = await post("/sync-leetcode", {});
      if (i >= 8) assert.equal(response.status, 429);
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
