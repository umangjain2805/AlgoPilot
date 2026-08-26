# PRD — AI LeetCode Coach

> Product Requirements Document · v1.0 · 2026-08-26

## 1. Overview

**AI LeetCode Coach** is a web platform that takes a user's LeetCode username, fetches
their solved-problem history, and — using the **Striver DSA Sheet** as the problem pool
and **Google Gemini** as the ranking brain — recommends the next problems they should
practice.

Recommendations are structured around **weak topics**: the system finds the topics the
user has practiced least and returns a mix of

- **Revision problems** — already-solved problems from weak topics (to re-practice), and
- **Fresh problems** — never-solved problems, prioritized toward those same weak topics.

The **user controls the output**: they pick *how many total* questions they want and
*how many of those should be revision vs. new*.

## 2. Problem statement

Preparing for coding interviews is hard because there are thousands of LeetCode problems
and no clear "what should I do next?" signal. Generic lists (blind-75, NeetCode, …) are
not personalized. This product answers one question precisely:

> "Given what I've already solved, **what should I practice next?**"

## 3. Goals

- Fetch and store a user's solved LeetCode problems (by `titleSlug`).
- Maintain a curated problem bank sourced from the **Striver DSA Sheet**.
- Compute each user's **weak topics** from their solved-vs-total coverage.
- Generate personalized recommendations using **Gemini**, with a deterministic fallback.
- Let the user choose **total count** and **revision-vs-new split** per request.
- Make discovery visually engaging (gamified, NFT-inspired cards).

## 4. Non-goals (this phase)

- No in-app code editor / judge — "Solve" links out to LeetCode.
- No full LeetCode catalog sync (the pool is the Striver sheet, not all ~3,200 problems).
- No social features beyond what already exists (no follow graph, comments, etc.).
- No mobile native app — responsive web only.

## 5. Personas

| Persona | Need |
| --- | --- |
| **Interview candidate** | Structured prep, knows their weak areas, wants a daily plan. |
| **DSA beginner** | Guided progression (easy → medium → hard) with topic coverage. |
| **Returning practitioner** | Consistency via streaks, revision of forgotten topics. |

## 6. Scope & phases

| Phase | Status | Content |
| --- | --- | --- |
| 1 | ✅ Built | Auth (JWT cookie + Google OAuth + guest mode). |
| 2 | ✅ Built | LeetCode connect → fetch profile + solved slugs → store. |
| 3 | ✅ Built | Profile / Progress / Settings UI, sync & disconnect. |
| **4** | **🚧 This doc** | Striver sheet import, Gemini-powered recommendations, Recommendations UI. |
| 5 | Later | Gamification depth (achievements, streaks leaderboard), company-tag filtering. |

## 7. Functional requirements

### 7.1 Auth (existing)
- FR-1: Local email/password registration and login.
- FR-2: Google OAuth sign-in (auto-register on first use).
- FR-3: Guest mode with limited access.
- FR-4: Session persisted via secure HttpOnly JWT cookie (7 days).

### 7.2 LeetCode integration (existing)
- FR-5: Validate and connect a LeetCode username.
- FR-6: Fetch public profile (avatar, ranking, per-difficulty solved counts, acceptance
  rate, badges, heatmap, recent submissions).
- FR-7: Fetch the **full list of solved slugs** via the public `acSubmission` endpoint.
- FR-8: Sync (refresh) the profile on demand; disconnect.

### 7.3 Problem bank (new)
- FR-9: Import the Striver DSA Sheet from a **JSON or CSV file** into the `Problem`
  collection via a seed script.
- FR-10: Each problem stores `titleSlug`, `title`, `difficulty`, `topic` (Striver
  category), optional `tags`, `url`, and optional order `index`.
- FR-11: Seed is idempotent (upsert by `titleSlug`), so the sheet can be re-imported.

### 7.4 Recommendation engine (new)
- FR-12: `POST /api/leetcode/recommendations` accepts `{ total, solvedSplit }`.
  - `total` (1–50): number of problems to return.
  - `solvedSplit` (0–`total`): how many are **revision** (solved, weak-topic).
  - Remaining `total − solvedSplit` are **fresh** (never-solved).
- FR-13: Compute weak topics as the topics with the **lowest solved-to-total coverage**
  in the Striver sheet (see architecture doc).
- FR-14: Return two groups — `revision[]` and `fresh[]` — each item with a short
  `rationale`, `difficulty`, `topic`, and `url`.
- FR-15: Use Gemini when `GEMINI_API_KEY` is present; otherwise fall back to the
  deterministic heuristic (`source: "heuristic"`). Any Gemini error → fall back.
- FR-16: Persist the last generated set to `LeetCodeProfile.lastRecommendations`.
- FR-17: `GET /api/leetcode/recommendations` returns the last set without regenerating.

### 7.5 Recommendations UI (new — see ui.md)
- FR-18: Two inputs — Total questions and Revision count — with live validation.
- FR-19: A green **Generate** CTA; loading, empty, and error states.
- FR-20: Results grouped into **Revision (weak topics)** and **New (unsolved)**.
- FR-21: Each card shows difficulty badge, topic tag, rationale, and a "Solve" link.

### 7.6 Progress & gamification (existing + minor)
- FR-22: Dashboard/profile show solved counts, streak, ranking.
- FR-23: (Phase 5) Achievement badges, streaks, topic-coverage progress bars.

## 8. Non-functional requirements

| Id | Requirement |
| --- | --- |
| NFR-1 | Recommendation generation returns in < ~10s (Gemini) / < ~1s (heuristic). |
| NFR-2 | All LeetCode calls are rate-limit aware; the solved-slugs fetch is best-effort (never blocks the request). |
| NFR-3 | Gemini calls are bounded (one request per generation, JSON responseMode, timeout). |
| NFR-4 | Secrets (`GEMINI_API_KEY`, JWT, cookie secret) never reach the client. |
| NFR-5 | `Problem` collection indexed on `titleSlug` (unique) and `topic` for weak-topic aggregation. |
| NFR-6 | The whole API is rate-limited (existing `express-rate-limit`). |
| NFR-7 | NoSQL-injection sanitized (existing `mongoSanitize`); request bodies capped at 10kb. |

## 9. User stories

- **As a candidate**, I want to connect my LeetCode profile so the coach knows what I've
  solved.
- **As a candidate**, I want to say "give me 10 problems, 4 revision + 6 new" and get a
  personalized list, so I never have to decide what to do next.
- **As a beginner**, I want new problems in weak topics ranked easy → medium → hard.
- **As a returning user**, I want my weak topics re-surfaced so I actually revise them.
- **As a user without a Gemini key**, I still want sensible recommendations (heuristic).

## 10. Acceptance criteria (Phase 4)

1. A provided Striver JSON/CSV imports cleanly into `Problem`; re-running the seed does
   not duplicate rows.
2. Given a connected user, generating with `{ total: 10, solvedSplit: 4 }` returns
   exactly 4 revision + 6 fresh problems, all distinct, none requiring payment.
3. Revision problems are drawn from the user's solved set in their weakest topics; fresh
   problems are not in `solvedSlugs`.
4. With a Gemini key, `source === "gemini"` and results include reasons; with no key, the
   request still succeeds with `source === "heuristic"`.
5. The Recommendations UI lets the user set both knobs and renders the two groups.
6. Guest users without a connected profile cannot call the recommendation endpoint.

## 11. Out of scope / future

- Topic "mastery" scoring from attempt history (currently only solved-coverage is used).
- Adaptive spaced-repetition schedule (recurring revision due-dates).
- Per-company tag filtering and mock-interview mode.
- In-app editor, test runner, or submission.
