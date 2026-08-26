# Tech Stack — AI LeetCode Coach

## 1. Overview

Monorepo with two workspaces: `client/` (React SPA) and `server/` (Express API).

| Layer | Choice |
| --- | --- |
| Frontend | React 19, Vite 8, Tailwind CSS 4, Redux Toolkit, React Router 7 |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB |
| Auth | JWT (HttpOnly cookie) + Google OAuth 2.0 + guest accounts |
| AI | Google Gemini (`@google/generative-ai`) |
| External data | LeetCode GraphQL + public REST endpoints |

## 2. Client dependencies (`client/package.json`)

| Package | Purpose |
| --- | --- |
| `react`, `react-dom` | UI |
| `react-router-dom` | Routing + route guards |
| `@reduxjs/toolkit`, `react-redux` | State management |
| `axios` | HTTP client (interceptor adds credentials) |
| `tailwindcss`, `@tailwindcss/vite` | Styling (v4 theme tokens in `index.css`) |
| `framer-motion` | Animations / transitions |
| `lucide-react` | Icon set |
| `react-hook-form` | Form handling (auth, connect form) |
| `react-hot-toast` | Toasts |
| `recharts` | Progress charts |

Dev tooling: `vite`, `oxlint`, `prettier`, `@vitejs/plugin-react`, React types.

## 3. Server dependencies (`server/package.json`)

| Package | Purpose |
| --- | --- |
| `express` 5 | Web framework |
| `mongoose` 9 | ODM |
| `bcryptjs` | Local password hashing |
| `jsonwebtoken` | JWT sign/verify |
| `cookie-parser` | Signed auth cookie |
| `google-auth-library` | Verify Google ID tokens |
| `helmet`, `cors`, `express-rate-limit`, `mongo-sanitize`* | Security |
| `morgan` | Request logging |
| `dotenv` | Env config |
| `express-validator` | Request validation |

> \* NoSQL-injection sanitization is implemented in-repo as
> `server/middleware/mongoSanitize.js`.

### To add (Phase 4)

| Package | Purpose |
| --- | --- |
| `@google/generative-ai` | Gemini recommendations |

Dev tooling: `nodemon`, `eslint`, `prettier`.

## 4. Environment variables (`server/.env`)

| Variable | Required | Notes |
| --- | --- | --- |
| `PORT` | no (5000) | |
| `NODE_ENV` | no | development/production |
| `MONGODB_URI` | no (local) | |
| `JWT_SECRET` | **yes** | |
| `JWT_EXPIRE` | no (7d) | |
| `CLIENT_URL` | no (5173) | CORS origin |
| `GOOGLE_CLIENT_ID` | for Google login | |
| `GOOGLE_CLIENT_SECRET` | for Google login | |
| `COOKIE_SECRET` | **yes** | cookie signing |
| `GEMINI_API_KEY` | optional | recommendations fall back to heuristic when missing |

## 5. Data

- **MongoDB** collections: `users`, `leetcodeprofiles`, `problems` (new).
- **Static seed:** `server/data/leetcode-problems.json` (390 classic problems). Phase 4
  supersedes this as the recommendation pool with the **Striver sheet** (imported into
  `problems`), keeping the classic list as an optional fallback/display source.

## 6. Third-party integrations

### 6.1 LeetCode
- `POST https://leetcode.com/graphql` (profile, contest, recent submissions).
- `GET https://leetcode.com/api/{username}/acSubmission/` (solved slugs).
- Transported through the system **`curl`** binary to bypass TLS fingerprint blocking.
- CSRF cookie cached per-process, refreshed on 403.

### 6.2 Google Gemini
- `@google/generative-ai` + `GenerativeModel(...).generateContent(...)`.
- JSON response mode (`responseMimeType: 'application/json'`).
- Single call per generation; short timeout; validated against an expected schema.

### 6.3 Google OAuth
- Server-side ID-token verification (`verifyGoogleToken`).

## 7. API conventions

- Base path `/api`; JWT in an HttpOnly cookie (`token`).
- Responses follow a uniform envelope:

```json
{ "success": true, "message": "...", "data": { ... }, "error": null }
```

- Errors use `ApiError(status, message)` → centralized `errorMiddleware`.
- All handlers wrapped in `asyncHandler`.
- Rate limited globally on `/api` (15-min window, 100 requests).

## 8. Endpoints

### Auth (`/api/auth`)
- `POST /register`, `POST /login`, `POST /logout`
- `POST /google`
- `POST /guest`
- `GET /me`

### LeetCode (`/api/leetcode`, authenticated + non-guest)
- `POST /connect`, `GET /profile`, `POST /sync`, `DELETE /disconnect`
- **`POST /recommendations`** (new) → generate
- **`GET /recommendations`** (new) → last generated

## 9. Coding conventions

- ES modules throughout (`"type": "module"`).
- File naming: `camelCase.js` for modules, `PascalCase.jsx` for components.
- Services return data; controllers serialize; models carry schema + minimal logic.
- Client state changes only via Redux slices; components read via `useAuth`/`useLeetCode`.
- Styling uses Tailwind theme tokens (`primary`, `accent`, `ink`, `glass*`) defined in
  `client/src/index.css` — do not hardcode hex in components.
