# Sprint 1 – Core Data, Expenses CRUD, Quick Add, Basic Dashboard

Dates: Aug 23 – Aug 29, 2025
Owner: @hritikyadav07
Status: Planned

## Sprint goal
Ship the foundation: a Postgres-backed API with per-user scoping, categories and expenses CRUD with filters, and a quick-add + basic dashboard on the frontend. After Sprint 1, you can add expenses, view them, and see basic totals.

## Scope
- Backend: Postgres setup, models, migrations, user scoping (Clerk), Categories + Expenses endpoints, filtering, and minimal analytics for dashboard tiles.
- Frontend: API client with Clerk token injection, Quick Add modal, expenses list with basic filters, dashboard tiles (this month total, last 7 days, recent expenses).

## Dependencies
- Clerk issuer configured in backend `.env` (`CLERK_ISSUER`).
- Postgres running locally; backend `.env` has `DATABASE_URL`.
- Frontend and backend run at `http://localhost:3000` and `http://localhost:8000`.

## Definitions
- Currency: single per user (default TBD; set in user profile on first request).
- Amounts: stored in integer minor units (e.g., paise/cents) to avoid floats.
- User scoping: use Clerk JWT `sub` as `user.clerk_sub`.

---

## Backend work

### B1. Dependencies & project setup
- Add packages: SQLAlchemy, Alembic, psycopg (psycopg[binary] for dev), python-multipart (later for receipts), email-validator (optional), fastapi-utils (optional).
- Update `backend/requirements.txt` and install.
- Add `DATABASE_URL` to `backend/.env`.

Acceptance
- `uvicorn main:app --reload` starts without DB errors.

### B2. DB engine, session, base
- Create `db.py` with engine from `DATABASE_URL`, `SessionLocal`, and `get_db` dependency.
- Base model via `DeclarativeBase`.

Acceptance
- Health endpoint can open and close a DB session successfully.

### B3. Models and migrations
- Models: `User`, `Category`, `Expense`, `ExpenseTag`.
- Alembic init and first migration to create tables and basic indexes.
- Constraints: FK on user_id; composite PK for ExpenseTag (expense_id, tag).
- Indexes: expense_date, category_id, user_id.

Acceptance
- `alembic upgrade head` creates all tables; downgrade/upgrade cycles cleanly.

### B4. Auth integration & user upsert
- Extract Clerk `sub` from verified JWT (existing verify_token). Map to `User` row (upsert on first call) and inject `current_user` in route deps.
- Store `email` (if present in JWT) and default `currency_code` on first upsert.

Acceptance
- First authenticated call creates a `User` row; subsequent calls reuse it.

### B5. Seed starter categories
- On first authenticated request for a new user, seed a default set of categories (e.g., Food, Transport, Groceries, Rent, Entertainment, Utilities, Health, Shopping, Travel, Misc).
- Mark `is_default=true` on seeds; users can add/delete their own.

Acceptance
- New user sees ~8–10 seed categories on GET `/categories`.

### B6. Categories API
- Endpoints (all scoped to `current_user`):
  - GET `/categories`
  - POST `/categories` { name, icon? }
  - PATCH `/categories/{id}` { name?, icon? }
  - DELETE `/categories/{id}` (reject if used by expenses unless `force=true` or reassign)
- Validation: unique name per user (case-insensitive).

Acceptance
- CRUD works with validation; attempting duplicate name returns 409.

### B7. Expenses API
- Endpoints:
  - GET `/expenses?from=&to=&categoryId=&tag=&merchant=&paymentMethod=&limit=&offset=`
  - POST `/expenses` { amount, categoryId, date, paymentMethod?, merchant?, note?, tags?[] }
  - PATCH `/expenses/{id}`
  - DELETE `/expenses/{id}`
- Behavior:
  - Store amount in minor units; derive from decimal client value safely.
  - Enforce category ownership; tag upsert into ExpenseTag table.
  - Pagination: default limit 20, max 100.
  - Sorting: default `expense_date DESC, id DESC`.

Acceptance
- Filter combos return expected rows; pagination stable; editing tags updates join table.

### B8. Dashboard tiles API
- Lightweight endpoints/queries:
  - GET `/analytics/summary?granularity=month|week` for totals (current month, last 7 days).
  - Or include computed fields in `/expenses/summary`.

Acceptance
- Returns: { totalThisMonth, totalLast7d } for authenticated user.

### B9. Error handling & responses
- Consistent HTTP codes: 400 (validation), 401 (auth), 403 (foreign user data), 404 (not found), 409 (conflict), 422 (semantic), 500 (unexpected).
- Pydantic response models for Categories and Expenses (list + item).

Acceptance
- Error cases return correct codes and helpful messages.

### B10. Minimal tests (happy + 1 edge)
- Unit/integration tests for: category duplicate name (409), expense creation + filter by date range, pagination caps, unauthorized access.

Acceptance
- Tests run locally and pass; cover main flows from Sprint 1.

---

## Frontend work

### F1. API client & config
- Central API client that injects Clerk token via `getToken({ template: 'backend' })`.
- Base URL from `NEXT_PUBLIC_API_BASE`.
- Choose SWR or React Query (pick one for cache + revalidation).

Acceptance
- Client attaches Bearer token correctly; 401s handled by redirect to login.

### F2. Types & utils
- Define TypeScript types for Category, Expense, and API payloads.
- Money utils: parse/format to minor units; date helpers.

Acceptance
- Types compile cleanly; no any-typed API responses.

### F3. Quick Add modal/sheet
- Trigger button pinned on `/dashboard`.
- Fields: amount (required), category (required), date default today, payment method (optional), merchant (optional), note (optional), tags (chips).
- Keyboard-first flow; validation errors inline.
- Success: optimistic update or refetch expense list and tiles.

Acceptance
- Add expense in < 10s typical; modal closes and dashboard updates.

### F4. Expenses list + filters
- List view on `/dashboard` below tiles: shows recent expenses.
- Filters: date range (last 7/30/custom), category, payment method, merchant (text), tag.
- Pagination: load more (infinite) or page numbers.

Acceptance
- Filtering updates list; pagination stable on filter changes.

### F5. Dashboard tiles (basics)
- “This month total”, “Last 7 days total”, and “Recent expenses” widget.
- Loading/empty/error states.

Acceptance
- Values match backend summary; recent expenses reflect latest entries.

### F6. UX polish & accessibility
- Focus management in modal; ESC to close; enter to submit.
- Button disabled while submitting; toasts for success/error.

Acceptance
- Lighthouse a11y for the dashboard ≥ 90 (local run).

### F7. Minimal e2e smoke (optional)
- Cypress/Playwright: login, add expense, see in list and totals.

Acceptance
- Smoke test passes locally.

---

## Data & contracts (v1)

### Category
- POST request: { name: string, icon?: string }
- Response: { id, name, icon, isDefault, createdAt }

### Expense
- POST request: {
  amount: number (decimal string or float on client; convert to minor on server),
  categoryId: string,
  date: YYYY-MM-DD,
  paymentMethod?: string,
  merchant?: string,
  note?: string,
  tags?: string[]
}
- Response: { id, amountCents, currencyCode, expenseDate, categoryId, paymentMethod?, merchant?, note?, tags: string[], createdAt }

### Summary
- GET response: { totalThisMonthCents, totalLast7dCents }

---

## Acceptance criteria (Sprint-level)
- Create, edit, delete, and list expenses and categories via UI; data persists in Postgres.
- Dashboard shows totals for this month and last 7 days and reflects new entries.
- Per-user isolation enforced via Clerk `sub`.
- Basic filters work and return accurate results.
- Minimal tests pass.

## Out of scope (Sprint 1)
- Budgets and charts (beyond basic totals).
- Reminders, exports, receipts, offline queue.

## Risks & mitigations
- JWT verification failures → cache JWKS and handle refresh; fallback/logging.
- Timezones for date filters → store dates in UTC and interpret expense_date as local-day boundary from client; document assumption.
- Performance on filters → add indexes on user_id + expense_date; limit result sizes.

## Task board (copy into issues)
- [] B1 Dependencies & setup
- [ ] B2 DB engine/session
- [ ] B3 Models & migrations
- [ ] B4 Auth integration & user upsert
- [ ] B5 Seed categories
- [ ] B6 Categories API
- [ ] B7 Expenses API
- [ ] B8 Summary endpoint
- [ ] B9 Error handling & responses
- [ ] B10 Minimal tests
- [ ] F1 API client & config
- [ ] F2 Types & utils
- [ ] F3 Quick Add modal
- [ ] F4 Expenses list + filters
- [ ] F5 Dashboard tiles
- [ ] F6 UX polish & a11y
- [ ] F7 Smoke test (optional)

## Demo checklist (end of sprint)
- [ ] Create new account → auto seed categories
- [ ] Add 3 expenses via Quick Add
- [ ] Filter by category + date range shows correct items
- [ ] Dashboard totals update and match query
- [ ] Attempt duplicate category name → 409
- [ ] Unauthorized call without token → 401
