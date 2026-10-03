import test from "node:test";
import assert from "node:assert/strict";
import problems from "../client/src/data/leetcode-problems.json" with { type: "json" };
import {
  buildAnalysis,
  buildPlan,
  parseSolvedHistory,
  normalizeProgress,
  mergeProgress,
  dueAt,
  DAY_MS,
} from "../client/src/lib/practice.js";
import { extractUsername } from "../client/src/lib/leetcode.js";

const profile = {
  leetcodeUsername: "tester",
  totalSolved: 100,
  solvedSlugs: ["two-sum"],
  history: { status: "partial" },
};

test("new practice excludes public solves, imported IDs/slugs, skipped and paid questions", () => {
  const analysis = buildAnalysis(profile, {
    solvedIds: [2, 3],
    solvedSlugs: ["valid-parentheses"],
    skippedSlugs: ["binary-search"],
  });
  const plan = buildPlan(analysis, 50);
  assert.equal(plan.revision.length, 0);
  assert.equal(plan.fresh.length, 50);
  assert.equal(new Set(plan.fresh.map((p) => p.titleSlug)).size, 50);
  for (const p of plan.fresh) {
    assert.equal(p.paidOnly, false);
    assert.equal(analysis.solvedSet.has(p.titleSlug), false);
    assert.notEqual(p.titleSlug, "binary-search");
    assert.ok(p.reason);
  }
});

test("topic names map to tags and merged topics count distinct free questions", () => {
  const analysis = buildAnalysis(profile);
  const topic = analysis.topics.find((t) => t.name === "Arrays");
  assert.equal(
    topic.total,
    problems.filter((p) => !p.paidOnly && p.tags.includes("Array")).length,
  );
  const trees = analysis.topics.find(
    (t) => t.name === "Trees (Binary Tree / BST)",
  );
  assert.equal(
    trees.total,
    problems.filter(
      (p) =>
        !p.paidOnly &&
        p.tags.some((tag) =>
          ["Tree", "Binary Tree", "Binary Search Tree", "Trie"].includes(tag),
        ),
    ).length,
  );
  for (const p of buildPlan(analysis, 10, "Arrays", "Medium").fresh) {
    assert.ok(p.tags.includes("Array"));
    assert.equal(p.difficulty, "Medium");
  }
});

test("empty pools stay empty instead of filling with solved questions", () => {
  const analysis = buildAnalysis({
    ...profile,
    solvedSlugs: problems.map((p) => p.titleSlug),
  });
  const plan = buildPlan(analysis, 10);
  assert.equal(plan.fresh.length, 0);
  assert.equal(plan.revision.length, 0);
  assert.equal(plan.totalAvailable, 0);
});

test("revision only includes recorded solves and respects review intervals", () => {
  const now = Date.now();
  const progress = {
    reviews: { "two-sum": { completedAt: now - DAY_MS / 2, count: 0 } },
  };
  const analysis = buildAnalysis(profile, progress);
  const plan = buildPlan(analysis, 10, "all", "all", "revision", now);
  assert.equal(plan.revision.length, 0);
  assert.equal(plan.upcomingReviews, 1);
  const later = buildPlan(analysis, 10, "all", "all", "revision", now + DAY_MS);
  assert.deepEqual(
    later.revision.map((p) => p.titleSlug),
    ["two-sum"],
  );
  assert.equal(later.fresh.length, 0);
  assert.equal(dueAt({ completedAt: now, count: 2 }), now + 7 * DAY_MS);
});

test("imports accept numbers, slugs and URLs, deduplicate and reject malformed inputs", () => {
  const parsed = parseSolvedHistory(
    "1, 1\n2; two-sum https://leetcode.com/problems/two-sum/ leetcode.com/problems/binary-search/description/",
  );
  assert.deepEqual(parsed.solvedIds, [1, 2]);
  assert.deepEqual(parsed.solvedSlugs, ["two-sum", "binary-search"]);
  for (const invalid of [
    "",
    "0",
    "100001",
    "Two Sum",
    "https://example.com/problems/two-sum/",
    "https://leetcode.com/u/tester/",
  ]) {
    assert.throws(() => parseSolvedHistory(invalid));
  }
});

test("backup merges preserve solves, latest reviews and unique activity", () => {
  const now = Date.now();
  const activity = { slug: "two-sum", type: "solve", at: now };
  const a = {
    solvedSlugs: ["two-sum"],
    solvedIds: [1],
    reviews: { "two-sum": { completedAt: now - DAY_MS, count: 0 } },
    activity: [activity],
  };
  const b = {
    solvedSlugs: ["two-sum", "binary-search"],
    reviews: { "two-sum": { completedAt: now, count: 1 } },
    activity: [activity],
  };
  const merged = mergeProgress(a, b);
  assert.equal(merged.solvedSlugs.length, 2);
  assert.equal(merged.activity.length, 1);
  assert.equal(merged.reviews["two-sum"].count, 1);
  assert.deepEqual(normalizeProgress(null).solvedSlugs, []);
  assert.equal(
    normalizeProgress({ dailyGoal: -2, solvedSlugs: ["BAD"], solvedIds: [-1] })
      .dailyGoal,
    1,
  );
});

test("experience changes default difficulty rather than always serving Easy", () => {
  assert.equal(
    buildPlan(buildAnalysis({ ...profile, totalSolved: 5 }), 1).fresh[0]
      .difficulty,
    "Easy",
  );
  assert.equal(
    buildPlan(buildAnalysis({ ...profile, totalSolved: 100 }), 1).fresh[0]
      .difficulty,
    "Medium",
  );
});

test("profile URL parser refuses other hosts and non-profile LeetCode URLs", () => {
  assert.equal(extractUsername("https://leetcode.com/u/tester/"), "tester");
  assert.equal(extractUsername("@tester"), "tester");
  assert.equal(extractUsername("leetcode.com/tester/"), "tester");
  assert.equal(extractUsername("https://example.com/u/tester/"), "");
  assert.equal(extractUsername("https://leetcode.com/problems/two-sum/"), "");
});
