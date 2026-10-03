import test from "node:test";
import assert from "node:assert/strict";
import {
  fetchLeetCodeProfile,
  validateUsername,
} from "../server/services/leetcode/leetcodeService.js";
import { normalizeProfile } from "../server/services/leetcode/normalizer.js";

const publicUser = (username, total = 400) => ({
  username,
  profile: {},
  submitStats: {
    acSubmissionNum: [{ difficulty: "All", count: total, submissions: 500 }],
    totalSubmissionNum: [{ difficulty: "All", count: 600, submissions: 1000 }],
  },
});
const payload = (data, status = 200) =>
  new Response(JSON.stringify({ data }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

test("username validation handles invalid types as client errors", () => {
  for (const value of [null, undefined, 42, [], {}, "", "a b"])
    assert.throws(() => validateUsername(value), { statusCode: 400 });
  assert.equal(validateUsername(" a "), "a");
});

test("acceptance rate uses submission totals and is unknown when missing", () => {
  const result = normalizeProfile({ matchedUser: publicUser("tester") });
  assert.equal(result.acceptanceRate, 50);
  assert.equal(
    normalizeProfile({ matchedUser: { username: "x" } }).acceptanceRate,
    null,
  );
});

test("partial history remains partial, concurrent requests share cache and optional failures are isolated", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    calls++;
    const { query, variables } = JSON.parse(options.body);
    if (query.includes("userPublicProfile"))
      return payload({ matchedUser: publicUser(variables.username) });
    if (query.includes("userContestRankingInfo")) return payload({}, 503);
    if (query.includes("query recentSubmissions"))
      return payload({
        recentSubmissionList: [
          {
            titleSlug: "two-sum",
            statusDisplay: "Wrong Answer",
            timestamp: "1000",
          },
          {
            titleSlug: "binary-search",
            statusDisplay: "Accepted",
            timestamp: "1001",
          },
        ],
      });
    if (query.includes("recentAcSubmissions"))
      return payload({
        recentAcSubmissionList: [
          { titleSlug: "binary-search" },
          { titleSlug: "binary-search" },
        ],
      });
    return payload({
      matchedUser: {
        tagProblemCounts: {
          fundamental: [{ tagName: "Array", problemsSolved: 100 }],
        },
      },
    });
  });
  const [a, b] = await Promise.all([
    fetchLeetCodeProfile("cache-test"),
    fetchLeetCodeProfile("cache-test"),
  ]);
  assert.equal(a, b);
  assert.equal(calls, 5);
  assert.equal(a.history.status, "partial");
  assert.equal(a.totalSolved, 400);
  assert.deepEqual(a.solvedSlugs, ["binary-search"]);
  assert.ok(a.warnings.some((message) => message.includes("Contest")));
  assert.equal(a.solvedTopicStats[0].total, null);
  await fetchLeetCodeProfile("cache-test");
  assert.equal(calls, 5);
});

test("failed accepted-history fetch is explicitly unavailable, not an empty solved account", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    const { query, variables } = JSON.parse(options.body);
    if (query.includes("userPublicProfile"))
      return payload({ matchedUser: publicUser(variables.username) });
    return payload({}, 503);
  });
  const result = await fetchLeetCodeProfile("unavailable-test");
  assert.equal(result.history.status, "unavailable");
  assert.equal(result.totalSolved, 400);
  assert.ok(
    result.warnings.some((message) =>
      message.includes("Accepted submission history"),
    ),
  );
});

test("missing users return 404 and upstream throttling remains 429", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    payload({ matchedUser: null }),
  );
  await assert.rejects(fetchLeetCodeProfile("missing-test"), {
    statusCode: 404,
  });
  t.mock.method(globalThis, "fetch", async () => payload({}, 429));
  await assert.rejects(fetchLeetCodeProfile("throttled-test"), {
    statusCode: 429,
  });
});
