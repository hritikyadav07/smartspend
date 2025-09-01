# Sprint 1 – Status Report (as of Sep 1, 2025)

Owner: @hritikyadav07  
Scope: Core data, Expenses CRUD (MVP), Quick Add, Basic Dashboard

## TL;DR
- Backend boots and connects to Neon Postgres using DATABASE_URL.  
- Auth wiring (Clerk JWT) is implemented; works once CLERK_ISSUER and a valid JWT are provided.  
- Models for User/Category/Expense/ExpenseTag exist; tables auto-create.  
- Categories and Expenses endpoints exist for list + create; summary endpoint exists.  
- Frontend has Clerk set up and can fetch with a backend JWT.

Key gaps for Sprint 1 acceptance:
- No PATCH/DELETE for categories/expenses yet.  
- No Alembic migrations applied (tables auto-create only).  
- Frontend missing Quick Add modal, expenses list/filters, tiles wiring, and typed API client.  
- Minimal tests not added yet.

---

## Backend – Itemized vs Sprint Plan

- B1 Dependencies & setup: Done
  - requirements.txt includes FastAPI, SQLAlchemy 2.x, psycopg[binary], uvicorn, requests, python-dotenv, alembic.
  - Server starts: `uvicorn main:app --reload` runs, CORS configured for http://localhost:3000.

- B2 DB engine/session/base: Done
  - `backend/db.py` provides engine, SessionLocal, DeclarativeBase, and `get_db`.
  - Note: We fixed `.env` load order in `main.py` so DATABASE_URL is present before importing db.py.

- B3 Models & migrations: Partial
  - Models present: `User`, `Category`, `Expense`, `ExpenseTag` with constraints and indexes.
  - Alembic not initialized/applied; tables are created via `Base.metadata.create_all()` (dev-only path).

- B4 Auth integration & user upsert: Done (implementation), Partial (verification)
  - `verify_token` validates Clerk JWT via JWKS; attaches payload to request.state.
  - User upsert logic present in middleware + route helpers (maps `sub` to `users.clerk_sub`, stores email, seeds categories on first access).
  - Works when CLERK_ISSUER is set and a valid Bearer token is provided.

- B5 Seed starter categories: Done
  - Seeds added on first authenticated access if none exist (middleware and categories route).

- B6 Categories API: Partial
  - Implemented: GET `/categories`, POST `/categories` with 409 on duplicate.
  - Missing: PATCH `/categories/{id}`, DELETE `/categories/{id}` (and safety checks).

- B7 Expenses API: Partial
  - Implemented: GET `/expenses` with filters, POST `/expenses` (minor units), tag join handling.
  - Missing: PATCH `/expenses/{id}`, DELETE `/expenses/{id}`.

- B8 Dashboard tiles API: Done (variant)
  - Implemented as `GET /expenses/summary` returning `{ totalThisMonthCents, totalLast7dCents }`.

- B9 Error handling & responses: Partial
  - Pydantic schemas in `schemas.py`; many paths return correct codes (400/401/404/409).  
  - Needs full sweep for PATCH/DELETE scenarios and consistent messages.

- B10 Minimal tests: Not started
  - No test suite present yet.

---

## Frontend – Itemized vs Sprint Plan

- F1 API client & config: Partial
  - Clerk integrated (`ClerkProvider` in `src/app/layout.tsx`, middleware protects routes).  
  - Dashboard page fetches backend using `useAuth().getToken({ template: 'backend' })`.  
  - Missing: centralized API client, retry/401 handling, and SWR/React Query integration.

- F2 Types & utils: Not started
  - No shared TS types for Category/Expense payloads; no money/date helpers yet.

- F3 Quick Add modal/sheet: Not started

- F4 Expenses list + filters: Not started

- F5 Dashboard tiles (basics): Partial
  - Placeholder dashboard page exists, but not yet wired to show totals or recent expenses.

- F6 UX polish & a11y: Not started

- F7 Minimal e2e smoke (optional): Not started

---

## What works right now
- Backend server runs and responds at `/` and `/dashboard` (requires valid JWT).  
- Auth verification against Clerk JWKS (RS256) with cache.  
- Neon DB connection established; tables `users`, `categories`, `expenses`, `expense_tags` exist.  
- GET/POST `/categories` and GET/POST `/expenses` function with valid token; summary endpoint returns totals.  
- A local `tools/inspect_db.py` script inspects tables/row counts quickly.

---

## Next actions (prioritized)
1) Backend CRUD completeness
   - Add PATCH/DELETE for `/categories/{id}` (reject delete if used, or `force=true` with reassignment).  
   - Add PATCH/DELETE for `/expenses/{id}`.
2) Migrations
   - Initialize Alembic, create baseline migration from current models, and apply to Neon.  
   - Remove dev-time `create_all` once migrations are in place.
3) Frontend API client
   - Create a typed API layer (with SWR or React Query) that injects `Bearer` from Clerk.  
   - Define TS types for Category/Expense and response shapes.
4) Quick Add modal (F3)
   - Amount, category (select), date (default today), optional fields; optimistic update or refetch.
5) Expenses list + filters (F4)
   - List recent expenses; add filter controls for date range, category, merchant, method, tag.
6) Dashboard tiles (F5)
   - Call `/expenses/summary`; render “This month” and “Last 7 days” totals; show recent expenses widget.
7) Tests (B10)
   - Add a minimal test set for duplicate category (409) and expenses filtering.

---

## Quick verify checklist
- Backend up: `uvicorn main:app --reload --port 8000`  
- Auth: set `CLERK_ISSUER` in `backend/.env` and get token with `getToken({ template: 'backend' })`.  
- Seed + list categories: `GET /categories` with `Authorization: Bearer <JWT>`.  
- Create expense: `POST /expenses` and then `GET /expenses/summary` for totals.

---

## Notes / Risks
- Relying on dev-time `create_all` instead of Alembic can drift schema; migrate ASAP.  
- Ensure JWT template in Clerk matches backend expectations (RS256, correct issuer).  
- Consider a DEV_NOAUTH switch only for local dev if auth becomes a blocker.
