# UI Design Specification — AI LeetCode Coach

> Cross-checked against the provided ("NFT → coding platform") UI spec, reconciled with
> the **existing** design system in `client/src/index.css`.

## 1. Design concept

| Original (NFT) element | Coding-platform meaning |
| --- | --- |
| NFT Card | **Question Card** |
| Creator Profile | **User Profile** |
| NFT Value (ETH) | **Difficulty / Rating** |
| Bid Button | **Solve / Attempt** button |
| NFT Collection | **Problem Sets** (Striver sheet) |

Playful but productivity-focused: a bright accent for actions, clean light surfaces for
readability, and dark text for code/problem content. Dark mode is a first-class state.

## 2. Cross-check notes (spec vs. existing code)

| Topic | Provided spec | Existing app (`index.css`) | Resolution |
| --- | --- | --- | --- |
| Primary CTA color | **Neon green** | Indigo → violet → teal gradient | Introduce a **green accent** specifically for "Solve / Start / Generate" CTAs; keep indigo/teal for brand, nav, and secondary UI. |
| Card surface | Beige/white | Glassmorphism (`glass-card`, `glass`) | Use glass/white cards; not beige (keeps dark-mode consistency). |
| Illustrations | Soft pastels | Lucide icons + gradient tiles | Use **topic icon + gradient tile** as the "illustration" on each card. |
| Badge colors | Easy=green, Medium=yellow, Hard=red | (none defined) | Adopt exactly: **Easy=green, Medium=amber, Hard=red**. |
| Rounded buttons | Fully rounded | `rounded-xl` (12px) | Keep `rounded-xl`/`rounded-2xl`; full-pill (`rounded-full`) reserved for the primary Solve CTA. |

## 3. Design tokens

From `client/src/index.css` (`@theme`):

- **Brand / primary:** indigo scale `#6366f1` (500) → violet → teal (`accent` `#14b8a6`).
- **Ink (neutrals):** `ink-50` → `ink-950` (slate).
- **Fonts:** `--font-sans: Inter`, `--font-display: Sora`.
- **Surfaces:** `.glass`, `.glass-card`, `.gradient-hero`, `.gradient-text`,
  `.bg-grid-pattern`.
- **Components:** `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`,
  `.btn-google`, `.input-field`, `.form-label`.

### New tokens (Phase 4)

| Token | Value | Use |
| --- | --- | --- |
| `--color-success` / `green` accent | `#22c55e` (500), `#16a34a` (600) | "Solve / Start / Generate" CTAs |
| `--color-warn` (amber) | `#f59e0b` | Medium difficulty badge |
| `--color-danger` (red) | `#ef4444` | Hard difficulty badge |

## 4. Screens → pages map

| Provided spec screen | Actual page | Status |
| --- | --- | --- |
| A. Home / Question Discovery | `Dashboard` (overview) + **`Recommendations`** (the discovery/CTL) | Recommendations rebuilt in Phase 4 |
| B. User Profile | `Profile` | Exists (stats + tabs to extend) |
| C. Question Detail | **New** modal/route (problem preview) | New in Phase 4 |

## 5. Screen specifications

### 5.1 Recommendations / Discovery (primary screen)

Heading: **"Solve Random Questions"** · sub: **"Boost Your Coding Skills"**.

Components (top → bottom):

1. **Control panel (two knobs).**
   - **Total questions** — number input / slider, range 1–50, default 10.
   - **Revision (solved) count** — number input / slider, range 0–`total`, default 4.
   - Live validation: `solvedSplit ≤ total`; disable Generate otherwise.
2. **Primary CTA** — **"Generate"**, green, `rounded-full`, hover scale.
3. **Result groups** (two sections):
   - **🔄 Revision — weak topics** (`S` cards).
   - **✨ New — unsolved** (`total − S` cards).
4. **Source badge** — small pill: **"Gemini"** or **"Heuristic"**.

### 5.2 Question Card

- Rounded (`rounded-2xl`), light shadow / glass surface.
- Left: **icon tile** (topic illustration, gradient background + Lucide icon).
- Main: **title** (display font), **difficulty badge**, **topic tag(s)**.
- Meta: **estimated time** (e.g. "15 min").
- Action: **"Solve"** link → opens LeetCode in new tab; green, `rounded-full`.
- States: default hover = raised shadow + slight scale (framer-motion `whileHover`).

### 5.3 Profile screen

- **Header:** avatar, username, short bio (e.g. "DSA Enthusiast").
- **Stats:** Problems Solved, Current Streak, Ranking/Score.
- **Tabs:** Solved · Attempted · Bookmarked (Phase 5).
- **Grid:** Question cards with title, difficulty, status (`Solved` / `Pending`).

### 5.4 Question Detail

- **Preview:** title, difficulty badge, tags.
- **Description:** short problem-statement preview.
- **Stats:** Acceptance Rate, Total Submissions, Likes.
- **Timer:** optional (track solving time).
- **CTA:** **"Solve Now"** (green `rounded-full`) → LeetCode.

## 6. Component system

| Component | Spec |
| --- | --- |
| **Difficulty badge** | Easy → green, Medium → amber, Hard → red; soft bg + strong text; consistent min-width. |
| **Topic tag** | Neutral pill, small, e.g. `Arrays`, `DP`, `Graph`. |
| **Button (primary)** | Green, `rounded-full`, subtle hover scale + shadow shift. |
| **Button (secondary)** | Glass / outline, `rounded-xl`. |
| **Stat tile** | Glass card, large display-font value + muted label. |
| **Illustration** | Gradient tile + Lucide icon themed to topic. |

## 7. UX features

- **Smart suggestions** from **user history + weak topics + difficulty progression**
  (the recommendation engine).
- **Gamification:** streak tracking, progress bars, achievement badges.
- **Filtering:** by topic, difficulty, (company tags in Phase 5).

## 8. Interactions & motion

- Smooth screen transitions (framer-motion fade/up; existing `DashboardLayout` already
  wraps `Outlet` in a motion fade-up).
- Tap/click feedback: scale animation on primary CTAs and cards.
- Card hover highlight on web.

## 9. States & responsiveness

- **Loading:** spinner + skeleton cards.
- **Empty:** "Connect your LeetCode profile to get recommendations."
- **Error:** inline toast (react-hot-toast) + retry.
- **No Gemini key:** show "Heuristic" source badge + a soft note.
- **Responsive:** grid collapses from 3 → 2 → 1 columns; control panel stacks vertically
  on mobile; wide tables/cards scroll within their own `overflow-x` container.

## 10. Accessibility

- Difficulty conveyed by **text + color** (not color alone).
- Focus-visible rings on all interactive elements (existing `.btn-*` already include
  them).
- Cards that link to LeetCode use `target="_blank"` + `rel="noreferrer"`.
- Sufficient contrast in both light and dark modes for green/amber/red badges.

## 11. Target experience

Make practice **less boring**, give **clear quick suggestions**, and encourage **daily
consistency** — a visually engaging assistant that decides *what to solve next*.
