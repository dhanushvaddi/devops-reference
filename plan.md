# DevOps Interview Prep Platform — Full-Stack Conversion Plan

## Context
Converting a single static `index.html` (830 lines, 18 DevOps tools) into a production-grade full-stack interview prep platform. The current site uses localStorage and DOM manipulation. The new version needs proper auth, database-backed progress tracking, granular subtopic tracking, SEO-optimized routes, and modern UI — all built to eventually support monetization via AdSense and future premium features.

**Key decisions made:**
- Public content (no login to view) + login required to save/track progress
- Google + GitHub OAuth only (no email/password)
- Keep current 18 tools for MVP, design DB to support future System Design + AI/MLOps topics
- Interview prep focus for MVP
- No ad placeholders — AdSense auto-inserts

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router v6 (each tool = `/tool/:slug` for SEO) |
| Server state | React Query (TanStack Query) |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (via docker-compose for local dev) |
| ORM/Query | `pg` (node-postgres) with parameterized queries |
| Auth | Passport.js (Google + GitHub OAuth) + JWT in httpOnly cookie |
| Security | helmet, cors, express-rate-limit, zod validation, CSRF protection |
| SEO | react-helmet-async for per-page meta tags |

---

## Project Structure

```
devops-reference/
├── docker-compose.yml          # PostgreSQL for local dev
├── .env.example                # Template for env vars
├── .gitignore
├── package.json                # Root workspace config
│
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts            # Express app entry
│       ├── config/
│       │   ├── index.ts        # Env var loader
│       │   └── passport.ts     # Google + GitHub OAuth strategies
│       ├── middleware/
│       │   ├── auth.ts         # JWT verification
│       │   ├── rateLimiter.ts  # Rate limiting
│       │   └── errorHandler.ts # Central error handler
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── tools.routes.ts
│       │   ├── progress.routes.ts
│       │   └── focus.routes.ts
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── tools.controller.ts
│       │   ├── progress.controller.ts
│       │   └── focus.controller.ts
│       └── db/
│           ├── connection.ts   # pg Pool
│           ├── schema.sql      # Full DDL
│           ├── migrate.ts      # Run schema.sql
│           ├── seed-data.json  # All 18 tools data extracted from HTML
│           └── seed.ts         # Populate DB from seed-data.json
│
├── client/
│   ├── package.json
│   ├── vite.config.ts          # Proxy /api to Express
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx             # Router + layout
│       ├── index.css           # Tailwind directives + theme vars
│       ├── context/
│       │   ├── AuthContext.tsx  # User state, login/logout
│       │   └── ThemeContext.tsx # Dark/light mode
│       ├── services/
│       │   ├── api.ts          # Axios instance
│       │   ├── toolsService.ts
│       │   ├── authService.ts
│       │   ├── progressService.ts
│       │   └── focusService.ts
│       ├── hooks/
│       │   ├── useTools.ts
│       │   ├── useTool.ts
│       │   ├── useProgress.ts
│       │   └── useFocus.ts
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── ToolDetailPage.tsx
│       │   ├── TrackerPage.tsx
│       │   ├── StrategyPage.tsx
│       │   ├── FocusPage.tsx
│       │   ├── AIChatPage.tsx      # Stub for future
│       │   └── AuthCallbackPage.tsx
│       └── components/
│           ├── layout/
│           │   ├── Navbar.tsx
│           │   ├── Footer.tsx
│           │   └── ThemeToggle.tsx
│           ├── ToolCard.tsx
│           ├── SectionCard.tsx     # Subtopic with checkbox
│           ├── QAItem.tsx          # Collapsible Q&A with checkbox
│           ├── CodeBlock.tsx       # Syntax-highlighted code
│           ├── ProgressBar.tsx
│           ├── CategoryBadge.tsx
│           ├── TipBox.tsx
│           ├── LoginPrompt.tsx     # "Sign in to save progress"
│           ├── FocusButton.tsx     # Bookmark/star button
│           └── ProtectedRoute.tsx
│
└── index.html                  # Original file (kept for reference)
```

---

## Database Schema

```sql
CREATE TYPE content_type AS ENUM ('devops', 'system_design', 'ai_mlops');
CREATE TYPE oauth_provider AS ENUM ('google', 'github');

-- Users (OAuth only)
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  display_name  VARCHAR(255),
  avatar_url    TEXT,
  provider      oauth_provider NOT NULL,
  provider_id   VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_id)
);

-- Categories: core, security, obs, cloud
CREATE TABLE categories (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(50) UNIQUE NOT NULL,
  name          VARCHAR(100) NOT NULL,
  content_type  content_type DEFAULT 'devops',
  sort_order    INT DEFAULT 0
);

-- Tools: 18 DevOps tools (future: system_design, ai_mlops)
CREATE TABLE tools (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(50) UNIQUE NOT NULL,
  name          VARCHAR(100) NOT NULL,
  icon          VARCHAR(10) NOT NULL,
  category_id   INT REFERENCES categories(id),
  content_type  content_type DEFAULT 'devops',
  overview      TEXT NOT NULL,
  tip           TEXT,
  sort_order    INT DEFAULT 0
);

-- Sections: subtopics per tool (individually trackable)
CREATE TABLE sections (
  id            SERIAL PRIMARY KEY,
  tool_id       INT REFERENCES tools(id) ON DELETE CASCADE,
  title         VARCHAR(200) NOT NULL,
  bullets       JSONB NOT NULL DEFAULT '[]',
  code          TEXT,
  sort_order    INT DEFAULT 0
);

-- Q&A items per tool (individually trackable)
CREATE TABLE qa_items (
  id            SERIAL PRIMARY KEY,
  tool_id       INT REFERENCES tools(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  sort_order    INT DEFAULT 0
);

-- Granular progress: per section OR per Q&A item
CREATE TABLE user_progress (
  id            SERIAL PRIMARY KEY,
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  section_id    INT REFERENCES sections(id) ON DELETE CASCADE,
  qa_item_id    INT REFERENCES qa_items(id) ON DELETE CASCADE,
  completed     BOOLEAN DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  CONSTRAINT progress_one_target CHECK (
    (section_id IS NOT NULL AND qa_item_id IS NULL) OR
    (section_id IS NULL AND qa_item_id IS NOT NULL)
  ),
  UNIQUE(user_id, section_id),
  UNIQUE(user_id, qa_item_id)
);

-- Focus list: user-selected topics for interview prep
CREATE TABLE user_focus_list (
  id            SERIAL PRIMARY KEY,
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  tool_id       INT REFERENCES tools(id) ON DELETE CASCADE,
  section_id    INT REFERENCES sections(id) ON DELETE CASCADE,
  qa_item_id    INT REFERENCES qa_items(id) ON DELETE CASCADE,
  added_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Future tables (created now, populated later)
CREATE TABLE video_lessons (
  id            SERIAL PRIMARY KEY,
  tool_id       INT REFERENCES tools(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  youtube_url   TEXT NOT NULL,
  duration_sec  INT,
  sort_order    INT DEFAULT 0
);
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/tools` | Public | All tools with categories |
| `GET` | `/api/tools/:slug` | Public | Full tool detail + user progress if authed |
| `GET` | `/api/categories` | Public | Category list |
| `GET` | `/api/auth/google` | — | Redirect to Google OAuth |
| `GET` | `/api/auth/github` | — | Redirect to GitHub OAuth |
| `GET` | `/api/auth/callback/google` | — | OAuth callback, set JWT cookie, redirect to client |
| `GET` | `/api/auth/callback/github` | — | OAuth callback, set JWT cookie, redirect to client |
| `GET` | `/api/auth/me` | Required | Current user profile |
| `POST` | `/api/auth/logout` | Required | Clear JWT cookie |
| `GET` | `/api/progress` | Required | All progress for current user |
| `PUT` | `/api/progress` | Required | Toggle: `{ sectionId?, qaItemId?, completed }` |
| `GET` | `/api/focus` | Required | User's focus list |
| `POST` | `/api/focus` | Required | Add to focus list |
| `DELETE` | `/api/focus/:id` | Required | Remove from focus list |

---

## Key Features

### 1. Granular Progress Tracking
- Each section and Q&A item gets its own checkbox
- Checkboxes only appear for logged-in users; others see a "Sign in to track" prompt
- Tool-level completion = derived (all sections + all Q&A done)
- TrackerPage shows tool-level progress with expandable subtopic detail
- Optimistic UI updates via React Query mutations

### 2. Focus Mode
- Star/bookmark button on every section and Q&A item
- Dedicated `/focus` page shows all bookmarked items grouped by tool
- Users can check off items directly from focus page

### 3. SEO (20+ unique pages for AdSense)
- `/` — Home
- `/tool/linux`, `/tool/git`, `/tool/docker`, ... (18 tool pages)
- `/tracker` — Progress tracker
- `/strategy` — How to Answer
- `/focus` — Focus list
- = **22 unique routes** with distinct content
- `react-helmet-async` for per-page title + meta description

### 4. Auth Flow
- Google/GitHub OAuth via Passport.js
- JWT stored in httpOnly secure cookie (not localStorage)
- Frontend AuthContext calls `/api/auth/me` on mount
- Login buttons in Navbar; after OAuth, redirect back to original page

### 5. Dark/Light Mode
- Tailwind `dark:` class strategy
- Toggle in Navbar, preference saved to localStorage

### 6. AI Chat (Stub)
- `/ai-chat` route with BYOK (Bring Your Own Key) input
- "Coming soon" state for MVP
- No backend needed yet

---

## Build Order (Implementation Steps)

### Step 1: Scaffolding
- [ ] Root `package.json` with npm workspaces
- [ ] `docker-compose.yml` for PostgreSQL
- [ ] Scaffold Vite React app in `/client` with Tailwind
- [ ] Scaffold Express app in `/server` with TypeScript
- [ ] `.gitignore`, `.env.example`

### Step 2: Database
- [ ] `schema.sql` with all tables
- [ ] `seed-data.json` — extract all 18 tools from `index.html` lines 374-661
- [ ] `seed.ts` — populate DB from JSON
- [ ] `migrate.ts` — run schema

### Step 3: Public API
- [ ] `GET /api/tools` and `GET /api/tools/:slug`
- [ ] `GET /api/categories`
- [ ] DB query functions with parameterized queries

### Step 4: Frontend Core Pages (connected to API)
- [ ] `HomePage` — tool grid, category badges, progress bar
- [ ] `ToolDetailPage` — sections, code blocks, collapsible Q&A, tip box
- [ ] `StrategyPage` — deployment table, SLI/SLO/SLA, answer templates
- [ ] `TrackerPage` — tool grid with completion status
- [ ] Navbar with tool navigation, Footer with social links
- [ ] React Query hooks for data fetching

### Step 5: Auth
- [ ] Passport.js Google + GitHub strategies
- [ ] JWT cookie flow
- [ ] Auth routes + controller
- [ ] Frontend AuthContext, login buttons, AuthCallbackPage

### Step 6: Progress Tracking
- [ ] Progress API (GET/PUT)
- [ ] Checkboxes on SectionCard and QAItem components
- [ ] LoginPrompt for unauthenticated users
- [ ] TrackerPage wired to real data

### Step 7: Focus Mode
- [ ] Focus API (GET/POST/DELETE)
- [ ] FocusButton component
- [ ] FocusPage

### Step 8: Polish
- [ ] Dark/light mode
- [ ] Responsive design
- [ ] SEO meta tags
- [ ] Security hardening (helmet, rate limiting, CSRF, zod)
- [ ] AI chat stub page

---

## Verification Plan

1. **Database**: Run `docker-compose up`, then `npm run migrate && npm run seed`. Verify with `psql`: 4 categories, 18 tools, ~40 sections, ~70 QA items
2. **Public API**: `curl http://localhost:3001/api/tools` returns all 18 tools. `curl http://localhost:3001/api/tools/k8s` returns full K8s detail with sections and QA
3. **Frontend rendering**: Open `http://localhost:5173`, verify home grid shows 18 tools, click into tool detail, verify sections/code/QA render correctly
4. **Auth flow**: Click "Sign in with Google", complete OAuth, verify JWT cookie set, verify `/api/auth/me` returns user, verify Navbar shows user avatar
5. **Progress tracking**: Log in, check a section checkbox, refresh page — verify it persists. Log out — verify checkboxes replaced with login prompt
6. **Focus mode**: Bookmark a Q&A item, navigate to `/focus`, verify it appears. Remove it, verify it's gone
7. **SEO**: Check page source for each tool route — verify unique `<title>` and `<meta description>`
8. **Security**: Test rate limiting by sending 101 requests in 1 minute. Verify helmet headers in response. Verify CSRF token required on POST/PUT/DELETE
