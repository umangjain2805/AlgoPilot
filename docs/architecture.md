# Architecture — AI LeetCode Coach

## 1. High-level architecture

Monorepo, MERN stack. A React (Vite) SPA talks to an Express 5 API, which talks to
MongoDB (via Mongoose) and two external services: **LeetCode** and **Google Gemini**.

```mermaid
flowchart LR
    subgraph Client["Client — React + Redux Toolkit"]
        Pages[Pages: Dashboard / Profile / Progress / Recommendations / Settings]
        Slice[Redux slices: auth + leetcode(+recommendations)]
        Pages --> Slice
    end

    subgraph Server["Server — Express 5"]
        R[Routes] --> C[Controllers] --> S[Services]
        S --> M[Models]
        Mid[Middleware: auth, sanitize, rate-limit, errors]
    end

    Client -->|"axios (JSON, cookie)"| Server
    Server -->|"Mongoose"| DB[(MongoDB)]
    S -->|"GraphQL + acSubmission (curl)"| LC[LeetCode]
    S -->|"Gemini API"| GM[Google Gemini]
```

## 2. Layered server design

Follows the existing convention across the codebase: **routes → controllers → services →
models**. Controllers are thin; business logic lives in services.

```
server/
  routes/        leetcodeRoutes.js          (add POST/GET /recommendations)
  controllers/   leetcodeController.js      (generateRecommendations, getRecommendations)
  services/
    leetcode/    client.js, queries.js, normalizer.js, leetcodeService.js   (existing)
    recommendation/  recommendationService.js    (NEW — the engine)
    geminiService.js                              (NEW — Gemini wrapper)
  models/        User.js, LeetCodeProfile.js, Problem.js (NEW)
  scripts/       importStriverSheet.js      (NEW — seed the Problem collection)
  middleware/    auth, sanitize, rate-limit, errors
  utils/         ApiError, ApiResponse, asyncHandler
```

## 3. Client architecture

- **State:** Redux Toolkit. Slices `auth` and `leetcode`. Phase 4 adds recommendation
  thunks/state to the `leetcode` slice (or a dedicated `recommendations` slice).
- **Pages** rendered under a `DashboardLayout` (collapsible `Sidebar` + `TopNavbar`).
- **Data access:** a `useLeetCode()` hook centralizes selectors + actions; components
  never touch the store directly.
- **Routing:** `react-router-dom` with protected/guest/public guards.

## 4. LeetCode integration layer (existing)

LeetCode blocks non-browser TLS (Node `fetch` fails), so requests go through the system
`curl` binary with a cached `csrftoken` cookie:

- **GraphQL** (`/graphql`) → profile, contest ranking, recent submissions
  (`queries.js`).
- **REST** (`/api/{username}/acSubmission/`) → the full list of accepted submissions,
  reduced to unique `titleSlug`s and stored as `solvedSlugs[]`
  (`client.js#fetchAcSubmissionSlugs`). Best-effort: transport errors return `[]` so the
  connect/sync still completes.

## 5. Recommendation engine (Phase 4)

New service `recommendationService.js`, one main entry point:

```
generateRecommendations(userId, { total, solvedSplit }) → { count, source, revision[], fresh[] }
```

```mermaid
flowchart TD
    A[POST /api/leetcode/recommendations<br/>{ total, solvedSplit }] --> B[Load LeetCodeProfile<br/>solvedSlugs + counts]
    B --> C[Load Problem collection<br/>Striver sheet]
    C --> D[Partition by slug<br/>solved / unsolved]
    D --> E[Compute weak topics<br/>coverage per topic]
    E --> F[Build candidate pools<br/>revision = solved ∩ weak<br/>fresh = unsolved ∩ weak first]
    F --> G{Has GEMINI_API_KEY?}
    G -- yes --> H[Gemini ranks + writes rationale]
    G -- no / error --> I[Heuristic top-N selection]
    H --> J[Store lastRecommendations]
    I --> J
    J --> K[Return grouped result]
```

### 5.1 Partitioning

- `solved = { p ∈ Problems : p.titleSlug ∈ solvedSlugs }`
- `unsolved = Problems \ solved` (the "never solved" pool).
- Problems where `paidOnly = true` are excluded from **fresh** (can't be solved for free)
  unless the feature later opts in.

### 5.2 Weak-topic calculation

For every distinct Striver `topic` `t`:

```
coverage(t) = count(solved in t) / count(total in t)
weakTopics   = topics sorted by coverage ascending
```

Lowest coverage ⇒ most under-practiced ⇒ "weakest". This is computed locally (no extra
API calls) and is **also** passed to Gemini as context. Optional enrichments (Phases 5+):
fold in `acceptanceRate`, contest rating, and incidence of non-"Accepted" recent
submissions.

### 5.3 Revision vs fresh candidates

- **Revision pool** = solved problems whose `topic` is in the weakest topics — ordered
  weakest-topic-first, then by difficulty (easy → hard).
- **Fresh pool** = unsolved problems, ordered first by weak-topic membership, then by
  difficulty ramp, then by Striver order (`index`) as a stable tie-breaker.

### 5.4 Gemini pass

Compact prompt contains: profile summary (per-difficulty solved counts, acceptance rate,
contest rating) + top weak topics + the two candidate pools. Gemini is asked to return
JSON: `{ revision: [...S], fresh: [...(N−S)] }`, each item with a one-line `rationale`.
Response mode is JSON; on any failure (no key, timeout, malformed, error) the service
degrades to the heuristic and marks `source: "heuristic"`.

### 5.5 Heuristic fallback

Take the first `S` from the revision pool and the first `N−S` from the fresh pool. If a
pool is short (fewer weak-topic candidates than requested), fill from the remainder of
that pool, then — only if still short — pad from the other pool while preserving the
"never-solved" distinction of the fresh group.

## 6. Persistence shape

Result is stored in the existing `LeetCodeProfile.lastRecommendations` subdocument:

```
lastRecommendations: {
  count, source: 'gemini'|'heuristic', generatedAt,
  items: [{ slug, title, difficulty, topic, tags, url, rationale, kind: 'revision'|'fresh' }]
}
```

`kind` is a small addition to the existing item schema that lets the client render two
groups from one stored list.

## 7. Design decisions & tradeoffs

| Decision | Rationale | Tradeoff |
| --- | --- | --- |
| Striver sheet, not full catalog | Curated interview coverage, cheap, user-supplied | Misses problems outside the sheet |
| Store sheet in Mongo (`Problem`) | Aggregations by `topic` for weak-topic math, easy re-seed | Needs a seed script |
| Gemini + heuristic fallback | Best personalization, still works without a key | Two code paths to maintain |
| Weak topic = coverage gap | Simple, deterministic, explainable | Ignores actual attempt success per problem |
| `lastRecommendations` cached on profile | Instant re-render without an LLM call | Stale until regenerated |
| `curl` for LeetCode | Bypasses TLS bot protection | Adds a system-dependency assumption (curl present) |
| JSON response from Gemini | No fragile free-text parsing | Needs schema validation + retry |

## 8. Request lifecycle (end-to-end)

```
RecommendationsPage
   └─ set { total, solvedSplit }
        └─ dispatch generateRecommendations
             └─ axios POST /api/leetcode/recommendations (JWT cookie)
                  └─ authenticate + disallowGuest (middleware)
                       └─ recommendationController.generate
                            └─ recommendationService.generateRecommendations
                                 ├─ LeetCodeProfile.findOne(userId)
                                 ├─ Problem.find({})
                                 ├─ weak-topic + partition
                                 ├─ geminiService.recommend() | heuristic
                                 └─ profile.save() (lastRecommendations)
                  └─ 200 ApiResponse { count, source, revision[], fresh[] }
        └─ slice stores result → UI renders two groups
```
