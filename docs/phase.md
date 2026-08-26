# Phases & Build Prompts — AI LeetCode Coach

The product is delivered in **5 phases**. Each phase is decomposed into exactly **4
build prompts** — self-contained, actionable instructions you can hand to a developer or
an AI assistant to complete that phase.

## Phase overview

| # | Phase | Status | Goal |
| --- | --- | --- | --- |
| 1 | Foundation & Auth | ✅ Built | JWT auth (local + Google + guest), project scaffold |
| 2 | LeetCode Integration | ✅ Built | Connect username → fetch & store profile + solved slugs |
| 3 | Dashboard UI | ✅ Built | Profile / Progress / Settings screens + app shell |
| 4 | Recommendations | 🚧 Current | Striver sheet + Gemini → personalized revision & fresh picks |
| 5 | Gamification & Polish | ⏳ Future | Streaks, achievements, filtering, spaced repetition |

---

## Phase 1 — Foundation & JWT Auth ✅

**Prompt 1 — Scaffold the server.**
Set up the Express app: `server/app.js` with security middleware (helmet, cors,
cookie-parser, express-rate-limit, mongoSanitize), `config/env.js`, `config/database.js`,
and the shared utilities `ApiError`, `ApiResponse`, `asyncHandler`, plus centralized
`errorMiddleware` / `notFoundHandler`.

**Prompt 2 — User model + local auth.**
Create `User` model (name, email, password with bcrypt `pre('save')` hash, provider,
isGuest), and `register` / `login` / `logout` / `getMe` controllers. Sign a JWT and store
it in a secure HttpOnly cookie via `services/tokenService.js`.

**Prompt 3 — Google OAuth + guest mode.**
Add `services/googleAuthService.js` (verify Google ID token), `googleLogin` (auto-register
on first login), and `guestLogin` (creates a `isGuest` user). Wire routes in
`routes/authRoutes.js`.

**Prompt 4 — Client auth plumbing.**
Build the Redux auth slice, `authService` axios API layer, `useAuth` hook, route guards
(`ProtectedRoute`, `PublicOnlyRoute`, `GuestRoute`), and the auth pages (Register / Login)
with `react-hook-form`.

---

## Phase 2 — LeetCode Integration ✅

**Prompt 1 — GraphQL client.**
Implement `services/leetcode/client.js`: route requests through the system `curl` binary
to bypass TLS bot-blocking, cache the `csrftoken` cookie, and expose `leetcodeRequest`.
Add `queries.js` (profile, contest ranking, recent submissions).

**Prompt 2 — Normalizer + model.**
Write `services/leetcode/normalizer.js` (per-difficulty counts, acceptance rate, badges,
calendar/heatmap, recent submissions) and the `LeetCodeProfile` model (1:1 with `User`,
`solvedSlugs`, `lastRecommendations` scaffold).

**Prompt 3 — Profile service + API.**
Implement `services/leetcode/leetcodeService.js` (`connect`, `get`, `sync`, `disconnect`),
`controllers/leetcodeController.js`, `validators/leetcodeValidator.js`, and
`routes/leetcodeRoutes.js` (guarded by `authenticate` + `disallowGuest`).

**Prompt 4 — Solved slugs + client wiring.**
Add `fetchAcSubmissionSlugs` (public `acSubmission` endpoint → unique `titleSlug[]`,
best-effort). On the client: `features/leetcode/leetcodeService.js` + `leetcodeSlice.js`
+ `useLeetCode.js`, and `LeetCodeConnectForm` for username entry.

---

## Phase 3 — Dashboard UI ✅

**Prompt 1 — App shell.**
Build `DashboardLayout` with a collapsible `Sidebar` and `TopNavbar`, plus the
light/dark theme toggle and the existing design tokens (`.glass`, `.btn-*`, `.input-field`)
in `index.css`.

**Prompt 2 — Profile screen.**
`Profile.jsx` with `LeetCodeProfileHeader`, `LeetCodeStatsGrid`, `LeetCodeBadges`,
`LeetCodeContestCard`, `LeetCodeRecentSubmissions`, and a heatmap placeholder.

**Prompt 3 — Progress screen.**
`Progress.jsx` charting solved distribution (recharts), streak/active-days, and
per-difficulty trends.

**Prompt 4 — Settings + routing.**
`Settings.jsx` (sync / disconnect / account actions), a `Recommendations` placeholder, and
final route wiring under `/dashboard/*`.

---

## Phase 4 — Recommendations 🚧 (core feature)

**Prompt 1 — Striver sheet import.**
Create the `Problem` model (`titleSlug` unique, `title`, `difficulty`, `topic`, `tags`,
`url`, `paidOnly`, `index`) and `scripts/importStriverSheet.js` to idempotently upsert a
provided JSON/CSV Striver sheet into the `problems` collection.

**Prompt 2 — Gemini service.**
Add `@google/generative-ai`; implement `services/geminiService.js` (`recommend(...)` with
JSON response mode, schema validation, timeout, and graceful error → null so callers fall
back).

**Prompt 3 — Recommendation engine.**
Implement `services/recommendation/recommendationService.js`: load profile + problems,
partition solved/unsolved, compute weak topics by topic coverage, build `revision`
(solved ∩ weak) and `fresh` (unsolved) pools, run Gemini or the heuristic, and persist to
`lastRecommendations` (set `kind`, `source`, `generatedAt`).

**Prompt 4 — API + Recommendations UI.**
Add `POST/GET /api/leetcode/recommendations` (validator: `total` 1–50, `solvedSplit` ≤
`total`), client recommendation thunks/slice/hook, and rebuild `Recommendations.jsx` with
**Total** + **Revision** knobs, a green Generate CTA, and grouped **Revision / New** cards
(difficulty badge, topic tag, rationale, Solve link, source badge).

---

## Phase 5 — Gamification & Polish ⏳

**Prompt 1 — Streaks & achievements.**
Persist daily streak history and award achievement badges (e.g. "First 100 solved",
"7-day streak") derived from `heatmap` and `totalSolved`.

**Prompt 2 — Topic coverage visualization.**
Render per-topic solved/total progress bars and a "weak topics" panel on the Dashboard,
driven by the weak-topic engine from Phase 4.

**Prompt 3 — Filtering.**
Add topic / difficulty / company-tag filters to the discovery screen, with server-side
query support on the `problems` collection.

**Prompt 4 — Spaced repetition.**
Add a revision scheduler (due-dates per weak-topic problem) and optional daily
reminder/notification, closing the "encourage daily consistency" loop.

---

## Prompting conventions

- Each prompt is a **unit of work**: it should leave the app runnable at the end.
- Run in order; later prompts depend on earlier ones' files.
- Match the repo's conventions: ES modules, `camelCase` modules / `PascalCase` components,
  services-own-logic, controllers-serialize, Redux for all client state.
- Keep LeetCode and Gemini calls bounded and **fall back gracefully** on any error.
