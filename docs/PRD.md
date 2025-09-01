# SmartSpend – Problem Statement & Product Requirements (PRD)

Last updated: 2025-08-22
Owner: @hritikyadav07
Status: Draft v1.0 (ready for build)

## 1) Problem statement
People who easily forget day-to-day purchases tend to overspend because expenses go unrecorded and budgets aren’t visible at the right time. SmartSpend helps individuals quickly capture expenses, categorize them, and visualize spending against simple budgets, with reminders and insights to prevent overspending.

- For: Individual personal finance users (single user, single currency for now).
- Need: Ultra-fast capture, budget visibility, and timely nudges.
- Outcome: Reduced monthly overspend and better awareness of spending patterns.

## 2) Goals & non-goals
### Goals (MVP)
- Fast expense capture in under 10 seconds.
- Budgets (monthly and custom periods) with progress and alerts.
- Dashboards and charts (weekly/monthly; category-wise; month-over-month comparisons).
- Daily reminder to log expenses; weekly summary; nudge if no entries in 24h.
- Secure auth via Clerk and per-user data isolation.
- Export and “email my data to me” for safeguarding.
- Works well on mobile web and supports offline capture with later sync.

### Stretch (early post-MVP)
- Receipt image upload and parsing aids (basic storage + manual metadata; OCR later).
- Bank statement CSV import with flexible column mapping.
- Recurring expense suggestions (detect patterns and prefill entries).
- Yearly analytics once ≥ 6 months of data exists.
- AI-assisted spending trend insights.

### Non-goals (for now)
- Live bank connections, multi-currency wallets, shared/household budgets, tax reports.

## 3) Success metrics
- Primary: % of expenses captured within 24 hours of occurrence.
- Supporting:
  - Budget adherence rate (% of categories under budget).
  - Monthly overspend reduction vs baseline (%).
  - Capture streaks (weekly active users who log ≥ X expenses/week).
  - Time-to-add median (< 10s).

## 4) User and scope assumptions
- Personal use, single user per account (Clerk). Single currency per user (configurable setting).
- Manual entry acceptable if it’s very fast, searchable, and supported by reminders.
- Budget resets support both monthly (calendar) and custom periods.

## 5) User stories (MVP)
- As a user, I can add an expense with amount, category, date, payment method, merchant, and note quickly.
- As a user, I can view spending by category and by time period (week/month) with charts.
- As a user, I can create monthly and custom-period budgets per category and optionally an overall cap, and see remaining/overage.
- As a user, I receive a daily reminder to record expenses and a weekly summary of spending.
- As a user, I can export my data (CSV) and email it to myself.
- As a user, I can use the app on mobile; if offline, I can still add expenses which sync later.

### Early post-MVP stories
- As a user, I can upload a receipt photo to attach to an expense.
- As a user, I can import a bank statement CSV and map columns to fields.
- As a user, I receive suggestions for recurring expenses (e.g., rent on the 1st).
- As a user, I can add optional tags (e.g., shoes) to any expense to filter later.
- As a user, I can see yearly trends and AI insights after enough data exists.

## 6) Functional requirements
### Expense capture
- Fields: amount (required), category (required), date (default today), payment method (optional: cash/UPI/card/wallet/etc.), merchant (optional), note (optional), tags (0..N), receipt (optional).
- Quick-add UX: single sheet/dialog with smart defaults; recent categories shown first.
- Offline queue: store pending entries locally and sync when online.

### Categories & tags
- Starter set of common categories; user can add/edit/delete their own.
- Tags are free-form labels; 0..N per expense for flexible filtering.

### Budgets
- Per-category monthly budgets and custom-period budgets; optional overall cap.
- Reset options: calendar month or custom start/end.
- Budget progress: spent, remaining, burn rate; warn when trending to exceed.

### Analytics & dashboard
- Views: weekly, monthly; category breakdown; comparisons vs prior period.
- After ≥ 6 months, show yearly rollups and trends.
- Simple charts (bar/pie/line) for spend over time and category split.

### Reminders & notifications
- Daily reminder to log expenses (configurable time).
- Weekly summary email.
- Nudge if no entries in the last 24 hours.

### Data export & email
- Download CSV by date range; email the export to the user’s email.

### Security & privacy
- Auth via Clerk; all API routes scoped by user (Clerk sub).
- Data at rest in Postgres; receipt files in object storage (e.g., local/dev then S3 later).
- PII minimization; no third-party sharing.

## 7) Platform & architecture
- Frontend: Next.js 15 (App Router), Clerk, Tailwind/HeroUI. PWA-lite for offline capture (IndexedDB + background sync where available).
- Backend: FastAPI (Python), JWT verification with Clerk, Postgres as primary DB.
- Storage: Postgres for relational data; object storage for receipts (stubbed locally in dev).
- Analytics: computed summaries via SQL views/queries; AI insights later.

## 8) Data model (initial)
```
User                 (id PK, clerk_sub unique, email, currency_code, created_at)
Category            (id PK, user_id FK, name, icon, is_default, created_at)
Expense             (id PK, user_id FK, category_id FK, amount_cents, currency_code,
                    expense_date, payment_method, merchant, note, receipt_url,
                    created_at)
ExpenseTag          (expense_id FK, tag TEXT, PRIMARY KEY(expense_id, tag))
Budget              (id PK, user_id FK, name, category_id FK nullable for overall,
                    amount_cents, currency_code, period_type ENUM('monthly','custom'),
                    period_start_date, period_end_date, created_at)
ReminderPreference  (user_id PK/FK, daily_time_local, weekly_summary_day,
                    nudge_enabled, timezone)
ImportJob           (id PK, user_id FK, status, source, created_at)
```
Notes:
- Single currency per user; store currency on user; duplicate on rows for denormalized reads.
- amount stored in integer minor units (cents/paise) to avoid float issues.
- payment_method: enum-like string values; open set for now.

## 9) API outline (v1)
Auth: Bearer Clerk JWT (template: backend). All endpoints are per-user.

- GET /me → current user profile
- Categories
  - GET /categories
  - POST /categories { name, icon? }
  - PATCH /categories/:id
  - DELETE /categories/:id
- Expenses
  - GET /expenses?from=YYYY-MM-DD&to=YYYY-MM-DD&categoryId=&tag=&merchant=
  - POST /expenses { amount, categoryId, date, paymentMethod?, merchant?, note?, tags?[], receipt? }
  - PATCH /expenses/:id
  - DELETE /expenses/:id
  - POST /expenses/:id/receipt (multipart)
- Budgets
  - GET /budgets
  - POST /budgets { name, categoryId?, amount, periodType, periodStart?, periodEnd? }
  - GET /budgets/:id/status → { spent, remaining, burnRate, projection }
  - PATCH /budgets/:id
  - DELETE /budgets/:id
- Analytics
  - GET /analytics/summary?granularity=week|month&from=&to=
  - GET /analytics/categories?from=&to=
  - GET /analytics/compare?thisFrom=&thisTo=&prevFrom=&prevTo=
- Export
  - GET /export.csv?from=&to=
  - POST /export/email { from, to }
- Imports (post-MVP)
  - POST /imports/bank/csv (multipart) → starts ImportJob, returns mapping template
  - POST /imports/bank/csv/:jobId/map { mappings } → processes rows

## 10) UX notes
- “Quick Add” FAB or fixed button; first field is amount; keyboard-first flow; recent categories.
- Dashboard: budget cards with progress bars; recent expenses; quick links to add.
- Filters: by date range, category, tag, payment method.
- Receipts: simple preview and file replace.

## 11) Offline strategy (MVP)
- IndexedDB queue for new expenses while offline.
- Service Worker caches essential routes and assets.
- Background sync (if supported) to flush queue; manual “Sync now” fallback.
- Conflict strategy: client entries are authoritative; server echoes with canonical IDs on success.

## 12) Reminders & email
- Daily reminder time configurable; default 8pm local.
- Weekly summary email every Sunday 8am local.
- Nudge email if no entries logged in last 24 hours (optional toggle).

## 13) AI & insights (later)
- Pattern detection for recurring merchants and amounts; suggestions in quick-add.
- Trend notes: “Dining up 18% vs last month.”
- Privacy: on-device or backend-only, no third-party model unless explicitly enabled.

## 14) Security & privacy
- JWT verification against Clerk issuer; all data scoped by user_id from token sub.
- CORS restricted to frontend origin(s). Rate limiting on write endpoints.
- File uploads: validate size/type; virus scan hook later; presigned URLs when on S3.
- Backups for Postgres; exports downloadable by user only.

## 15) Milestones
- M1: Auth + DB schema + categories + expenses CRUD + quick add + basic dashboard.
- M2: Budgets (monthly + custom) + budget status + charts + comparisons.
- M3: Reminders (daily, weekly, nudge) + email export.
- M4: Receipts upload.
- M5: Bank CSV import (mapping UI + processing).
- M6: Offline PWA enhancements (IndexedDB queue + background sync).
- M7: Recurring suggestions + AI trend notes.

## 16) Tech notes
- Backend: FastAPI, SQLAlchemy, Alembic migrations, Postgres. Pydantic models. Uvicorn.
- Frontend: Next.js App Router, Clerk, Tailwind/HeroUI, IndexedDB (idb), SW.
- Charts: lightweight library (e.g., Chart.js via react wrapper) initially.
- Email: transactional provider later; dev: console/email file backend.

## 17) Acceptance criteria (MVP excerpt)
- Add expense flow completes in ≤ 10 seconds median in manual test.
- Budget card shows spent and remaining correctly for at least one category and for overall cap.
- Dashboard charts render weekly and monthly views and match API totals for selected range.
- Daily reminder configurable; weekly summary email sent in dev using a test transport.
- Export CSV downloads and email endpoint delivers file to the user’s email.
- Offline: create 3 expenses offline, then reconnect → all sync and appear on dashboard.
