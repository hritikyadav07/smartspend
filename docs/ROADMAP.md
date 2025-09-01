# SmartSpend – Execution Plan & Roadmap

Last updated: 2025-08-23
Owner: @hritikyadav07
Status: Ready to start

## Context (what’s already built)
- Frontend: Next.js 15 (App Router) with Clerk auth, Landing page, Login/Signup, protected `/dashboard` that calls backend with Clerk JWT.
- Backend: FastAPI, CORS for `http://localhost:3000`, Clerk JWT verification, public `/` and protected `/dashboard` routes.
- Decision: Postgres for persistence.
- Reference spec: PRD at `docs/PRD.md`.

## MVP Goals (phase focus)
1) Fast add expenses
2) Budgets (monthly + custom)
3) Charts (weekly/monthly, category-wise; comparisons)

Secondary (after MVP): reminders + export, receipts upload, CSV import, offline, recurring suggestions, AI insights.

## Timeline (4-week MVP)
- Sprint 1 (Aug 23 – Aug 29): DB + Expenses CRUD + Quick Add + Basic Dashboard
- Sprint 2 (Aug 30 – Sep 5): Budgets + Budget Status + Charts + Comparisons
- Sprint 3 (Sep 6 – Sep 12): Reminders (daily/weekly/nudge) + Export (CSV/email)
- Sprint 4 (Sep 13 – Sep 19): Offline support (IndexedDB queue + sync) + Receipts upload (stretch)

Notes: Dates are targets; adjust as needed. Keep scope tight to hit MVP by Sprint 2; Sprints 3–4 are polish and stretch.

## Deliverables by sprint

### Sprint 1 – Core data + expenses (Backend + Frontend)
[Detailed sprint plan → SPRINT-1.md](./SPRINT-1.md)
Backend
- Postgres wiring (SQLAlchemy + Alembic). Env vars: `DATABASE_URL`.
- Models and migrations: User, Category, Expense, ExpenseTag.
- Seed starter categories per user on first sign-in.
- Endpoints (auth-scoped):
  - GET/POST/PATCH/DELETE `/categories`
  - GET/POST/PATCH/DELETE `/expenses`
  - GET `/expenses` filters: from, to, categoryId, tag, merchant, paymentMethod
- Validation with Pydantic; minor-unit amounts; Clerk sub → user_id mapping.

Frontend
- Quick Add modal/sheet on `/dashboard` with fields: amount, category, date (default today), payment method (optional), merchant (optional), note (optional), tags (0..N).
- Expenses list with basic filters and pagination.
- Basic dashboard tiles: total this month, last 7 days, recent expenses.

Acceptance criteria
- Add, edit, delete expense works; data persists in Postgres.
- Per-user isolation verified; another token cannot access your data.
- Time-to-add flow usable with keyboard-first; recent categories suggested.

### Sprint 2 – Budgets + charts
Backend
- Model + endpoints for `Budget` with monthly and custom periods; optional overall budget (null category).
- Budget status endpoint: spent, remaining, burn rate, simple projection.
- Analytics endpoints: summary (week/month), categories breakdown, compare ranges.

Frontend
- Budgets page: create/edit budgets; show progress bars and warnings.
- Dashboard charts: weekly and monthly trend line/bar; category pie/bar.
- Comparisons: this month vs last month label/tooltip.

Acceptance criteria
- Creating budgets reflects correct status for current period.
- Charts match API totals for selected date ranges.
- Comparison view shows delta % and direction.

### Sprint 3 – Reminders + export
Backend
- `ReminderPreference` model and endpoints; schedule daily reminder, weekly summary, nudge.
- Email service abstraction; dev transport (console/file). Export CSV endpoints and email export job.

Frontend
- Settings UI for reminder times/timezone and toggles.
- Export UI (date range → download CSV or email to me).

Acceptance criteria
- Daily reminder time persisted; weekly summary generated in dev.
- CSV exports download and email endpoint sends via dev transport.

### Sprint 4 – Offline + receipts (stretch)
Backend
- Receipt upload endpoint (multipart) + local storage path (dev) with type/size validation.

Frontend
- Offline queue for new expenses using IndexedDB; background sync if supported.
- Attach/preview receipt on expense detail; upload on sync.

Acceptance criteria
- Create 3 expenses while offline → sync on reconnect; server shows all.
- Receipt files upload and link to expenses.

## Work breakdown by area

### Backend tasks
- Setup
  - Add SQLAlchemy, Alembic; configure `DATABASE_URL` in `.env`.
  - Create DB session dependency and base models.
- Auth & user scoping
  - Extract `sub` from Clerk JWT → upsert user on first request.
- CRUD
  - Categories, Expenses, Budgets, ReminderPreference endpoints and validation.
- Analytics
  - Aggregation queries for time series and category totals.
- Emails/exports
  - CSV generation; pluggable mailer (stdout/dev file, later provider).
- Files
  - Local file storage for receipts (later S3 adapter).

### Frontend tasks
- State & data
  - API client with token injection (Clerk `getToken({ template: 'backend' })`).
  - React Query or SWR for data fetching and cache.
- UI
  - Quick Add modal; Expenses list + filters; Budgets page; Dashboard charts.
  - Settings for reminders and exports.
- Offline
  - IndexedDB queue + retry; minimal service worker for caching.

## Environment & config
- Backend `.env`:
  - `CLERK_ISSUER=...`
  - `DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/smartspend`
- Frontend `.env.local`:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...`
  - `NEXT_PUBLIC_API_BASE=http://localhost:8000`

## Quality gates
- Build: backend runs `uvicorn` without errors; frontend `next build` passes.
- Lint/Typecheck: ESLint/TS ok; mypy/ruff optional later.
- Tests: minimal API tests for expenses and budgets; snapshot totals for analytics.
- Smoke: add expense, see it in list and chart; create budget, see progress.

## Definition of done (per feature)
- API implemented with validation, errors handled, and unit tests for happy + 1 edge.
- UI implemented with loading/empty/error states and basic a11y.
- Docs updated (README/PRD/ROADMAP as needed).

## Risks & mitigations
- JWT/JWKS reliability → cache JWKS and refresh on failure.
- Time precision/currency → use integer minor units and explicit currency.
- Offline complexity → start with simple IndexedDB queue and manual sync button.

## Issue checklist (copy/paste into tracker)
- [ ] Create DB models and Alembic migrations
- [ ] Add DB session and user scoping
- [ ] Categories CRUD (API + UI)
- [ ] Expenses CRUD (API + UI)
- [ ] Dashboard basic tiles
- [ ] Budgets model + CRUD + status (API + UI)
- [ ] Analytics endpoints (summary/categories/compare)
- [ ] Charts on dashboard
- [ ] Reminders prefs (API + UI) + dev email
- [ ] CSV export (download + email)
- [ ] Offline queue + sync
- [ ] Receipts upload (stretch)
