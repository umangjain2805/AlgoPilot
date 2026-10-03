# LeetCode Practice Coach

A React and Express practice planner with public profile lookup, free curated questions, topic coverage, imported solved history, daily goals, skip tracking, and scheduled revision.

## Run locally

Requires Node.js 22.19 or newer. From the project root:

```sh
npm --prefix client install
npm --prefix server install
npm run dev
```

Open http://localhost:5173. The API uses http://localhost:5000 by default.

```sh
npm test
npm run build
npm --prefix client run lint
npm --prefix server run lint
```

## Configuration

The only environment file is the root `.env`. The backend resolves it relative to its source file and Vite uses `envDir`, so both work regardless of the command's working directory. The file is excluded from Git. Only variables prefixed `VITE_` reach the frontend.

| Variable                    | Local default             | Purpose                                                              |
| --------------------------- | ------------------------- | -------------------------------------------------------------------- |
| PORT                        | 5000                      | API port                                                             |
| SERVER_NODE_ENV             | development               | Server environment (kept separate from Vite's production build mode) |
| CLIENT_URL                  | http://localhost:5173     | Allowed frontend origin                                              |
| VITE_API_URL                | http://localhost:5000/api | Browser API URL                                                      |
| LEETCODE_REQUEST_TIMEOUT_MS | 15000                     | Timeout per upstream request                                         |
| PROFILE_CACHE_TTL_MS        | 300000                    | Public profile cache freshness                                       |
| PROFILE_CACHE_MAX_ENTRIES   | 500                       | Maximum cached profiles                                              |
| API_RATE_LIMIT              | 60                        | Requests allowed per IP per window                                   |
| API_RATE_WINDOW_MS          | 900000                    | Rate-limit window                                                    |

An existing `MONGODB_URI` is preserved as an inactive setting. This version does not write public usernames to MongoDB. The old unverified session-cookie sync has been removed. Both `/sync-leetcode` and `/api/sync-leetcode` are rate-limited compatibility endpoints returning the same public profile as `/api/leetcode/fetch`; they reject session cookies.

## How recommendations work

New-question mode excludes public accepted slugs, previously observed accepted slugs, imported solved IDs/slugs, local completions, skipped questions, and paid questions. Topic aliases map to their actual tags; merged topics count distinct free curated problems. Difficulty adapts to experience, and topic buckets introduce variety. Each question explains its recommendation.

Public recent accepted submissions are not necessarily all-time history. The API reports `complete`, `partial`, or `unavailable`, with warnings. Complete means the current public slug list matches the reported solve count, or that count is zero. User imports remain self-reported and do not establish verified completeness. With partial history, older solved questions can still appear; the UI labels recommendations accordingly.

Import solved question numbers, slugs, or LeetCode problem URLs separated by commas, spaces or newlines. IDs outside the curated set are kept for future catalog expansion. A local completion removes a question from new practice immediately. Revision is optional and uses 1, 3, 7, 14 and 30 day intervals after recorded completions/reviews; recorded solves without a local review timestamp are available for their first review.

Progress is stored in this browser separately for each username. It is self-reported, not proof of account ownership. Export backups before clearing browser storage. Restore merges a backup only into its matching username. Undo removes the latest local completion/review for that question; imported and upstream-reported solves continue to exclude it.

## Reliability and deployment limits

The profile is required; contest, activity, accepted-history and tag-count requests are optional and fail independently. Cached upstream snapshots include fetch timestamps. Failed refreshes preserve the last successful browser profile. Concurrent requests for the same profile share an upstream load.

The default cache and rate limiter are per process. A multi-instance deployment needs shared caching/rate limits and a trusted proxy configuration matching its hosting platform. Cross-device accounts would require actual authentication and verified ownership before adding database writes.

This is a rule-based recommendation engine. Topic coverage and accepted-submission percentages are not mastery scores. Unknown acceptance rates display N/A. Daily goals count distinct locally completed/reviewed questions in the user's local calendar day.

The LeetCode integration uses an undocumented upstream interface and can change or be blocked. Establish an authorized integration before production use; LeetCode's terms prohibit crawling and scraping: https://leetcode.com/terms/.

Tests use mocked upstream responses; they do not assert that live LeetCode currently supports every query.
