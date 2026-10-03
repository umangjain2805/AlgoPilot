import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(
  new URL("../client/package.json", import.meta.url),
);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { MemoryRouter } = require("react-router-dom");
const { createServer } = await import(
  pathToFileURL(require.resolve("vite")).href
);

test("dashboard and analysis render saved profiles with honest history and tracking controls", async (t) => {
  const saved = new Map([
    [
      "ai-leetcode-coach:profile",
      JSON.stringify({
        profile: {
          leetcodeUsername: "render-test",
          totalSolved: 400,
          easySolved: 100,
          mediumSolved: 250,
          hardSolved: 50,
          solvedSlugs: ["two-sum"],
          history: { status: "partial" },
          recentSubmissions: [
            {
              submissionId: "1",
              title: "Two Sum",
              titleSlug: "two-sum",
              statusDisplay: "Wrong Answer",
              timestamp: Date.now() / 1000,
            },
          ],
        },
        savedAt: Date.now(),
      }),
    ],
  ]);
  const previousStorage = Object.getOwnPropertyDescriptor(
    globalThis,
    "localStorage",
  );
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => saved.get(key) || null,
      setItem: (key, value) => saved.set(key, value),
      removeItem: (key) => saved.delete(key),
    },
  });
  t.after(() => {
    if (previousStorage)
      Object.defineProperty(globalThis, "localStorage", previousStorage);
    else delete globalThis.localStorage;
  });
  const vite = await createServer({
    root: fileURLToPath(new URL("../client/", import.meta.url)),
    server: { middlewareMode: true },
    appType: "custom",
  });
  try {
    const { LeetCodeProvider, LeetCodeContext } = await vite.ssrLoadModule(
      "/src/context/LeetCodeContext.jsx",
    );
    const { default: Dashboard } = await vite.ssrLoadModule(
      "/src/pages/Dashboard.jsx",
    );
    const { default: AnalysisPage } = await vite.ssrLoadModule(
      "/src/pages/AnalysisPage.jsx",
    );
    let context;
    function Capture({ component }) {
      context = React.useContext(LeetCodeContext);
      return React.createElement(component);
    }
    const render = (component) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(
            LeetCodeProvider,
            null,
            React.createElement(Capture, { component }),
          ),
        ),
      );
    const dashboard = render(Dashboard);
    for (const text of [
      "Public solved history is incomplete",
      "New questions only",
      "Import solved history",
      "Export backup",
      "Mark solved",
      "Skip question",
      "Daily goal",
    ])
      assert.ok(dashboard.includes(text), text);
    assert.equal(
      dashboard.includes("1. Two Sum"),
      false,
      "known solved question must not appear in new plan",
    );
    const analysis = render(AnalysisPage);
    assert.ok(analysis.includes("Accepted submissions"));
    assert.ok(analysis.includes("N/A"));
    assert.ok(analysis.includes("Topic Practice Coverage"));
    context.importHistory("2, binary-search");
    context.completeProblem("valid-parentheses");
    context.skipProblem("3sum");
    context.setDailyGoal(5);
    render(Dashboard);
    assert.ok(context.analysis.solvedSet.has("add-two-numbers"));
    assert.ok(context.analysis.solvedSet.has("valid-parentheses"));
    assert.equal(context.analysis.completedToday, 1);
    assert.equal(context.progress.dailyGoal, 5);
    assert.equal(
      context.plan.fresh.some((p) => p.titleSlug === "3sum"),
      false,
    );
    assert.throws(
      () =>
        context.restoreBackup(
          JSON.stringify({
            version: 2,
            username: "another-user",
            progress: {},
          }),
        ),
      /currently loaded username/,
    );
    context.restoreBackup(
      JSON.stringify({
        version: 2,
        username: "render-test",
        progress: { solvedIds: [4] },
      }),
    );
    render(Dashboard);
    assert.ok(context.progress.solvedIds.includes(4));
    context.undoCompletion("valid-parentheses");
    context.restoreSkipped();
    render(Dashboard);
    assert.equal(context.analysis.completedToday, 0);
    assert.equal(context.progress.skippedSlugs.length, 0);
    const previousSnapshot = saved.get("ai-leetcode-coach:profile");
    t.mock.method(
      globalThis,
      "fetch",
      async () =>
        new Response(JSON.stringify({ message: "Upstream unavailable" }), {
          status: 503,
        }),
    );
    await context.sync();
    assert.equal(
      saved.get("ai-leetcode-coach:profile"),
      previousSnapshot,
      "failed refresh must preserve the snapshot",
    );
    let release;
    t.mock.method(
      globalThis,
      "fetch",
      () =>
        new Promise((resolve) => {
          release = resolve;
        }),
    );
    const pendingRefresh = context.sync();
    context.reset();
    release(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            profile: {
              leetcodeUsername: "render-test",
              totalSolved: 400,
              solvedSlugs: [],
            },
          },
        }),
        { status: 200 },
      ),
    );
    await pendingRefresh;
    assert.equal(
      saved.has("ai-leetcode-coach:profile"),
      false,
      "a late response must not restore a reset profile",
    );
    assert.ok(
      saved.has("ai-leetcode-coach:progress:v2"),
      "switching profile must preserve stored progress",
    );
    saved.set(
      "ai-leetcode-coach:profile",
      JSON.stringify({
        profile: {
          leetcodeUsername: "another-user",
          totalSolved: 0,
          solvedSlugs: [],
        },
      }),
    );
    render(Dashboard);
    assert.equal(
      context.progress.solvedIds.length,
      0,
      "a different username must not inherit solved IDs",
    );
  } finally {
    await vite.close();
  }
});
