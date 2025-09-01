# SmartSpend – Data Flow & Events

Last updated: 2025-08-23
Owner: @hritikyadav07

This document explains how data moves through SmartSpend across frontend, backend, and storage, and why specific decisions were made. It complements the PRD and Roadmap.

Links:
- PRD: ./PRD.md
- Roadmap: ./ROADMAP.md
- Sprint 1 plan: ./SPRINT-1.md

## Overview

- Identity: Clerk provides auth. The frontend obtains a short-lived JWT (template: `backend`) and calls the backend with `Authorization: Bearer <token>`.
- Backend: FastAPI validates the JWT signature and issuer via Clerk JWKS. It extracts the `sub` as user identity, upserts a `User` row, and scopes all queries by user_id.
- Storage: Postgres stores users, categories, expenses, tags, budgets, reminders, imports. Receipts later stored in object storage (local dev → S3).
- Analytics: Aggregations via SQL queries power dashboard tiles and charts.
- Notifications/Exports: Email service (dev: console/file) used for reminders and data export.
- Offline: IndexedDB queue stores pending expenses; background sync flushes them when back online.

## Core request flow (happy path)

Sequence: Dashboard loads → user adds expense → totals update

1) Frontend obtains token
- `useAuth().getToken({ template: 'backend' })`
- If missing/expired, Clerk middleware redirects to login.

2) Create expense
- Frontend POSTs to `POST /expenses` with token and payload: { amount, categoryId, date, paymentMethod?, merchant?, note?, tags?[] }
- Amount is user-entered decimal; client may send decimal string. Server converts to integer minor units.

3) Backend verifies token
- Extract `kid` from token header → fetch Clerk JWKS → find matching key.
- Decode with RS256; enforce `issuer = CLERK_ISSUER`.

4) Identify user and scope
- From `sub`, upsert a `User` if not exists.
- All subsequent DB reads/writes use `user_id`.

5) Validate and persist
- Validate category belongs to user.
- Insert `Expense` row and related `ExpenseTag` rows in a transaction.

6) Respond and refresh UI
- Backend returns expense; frontend updates list and re-fetches summary totals (this month, last 7 days).

ASCII diagram

Frontend            Clerk                 Backend (FastAPI)          Postgres
   |                  |                           |                     |
   | getToken()       |                           |                     |
   |----------------->|                           |                     |
   |  JWT             |                           |                     |
   |<-----------------|                           |                     |
   |  POST /expenses (Bearer JWT)                 |                     |
   |--------------------------------------------->|  verify JWT         |
   |                  |                           |  upsert user        |
   |                  |                           |  insert expense     |
   |                  |                           |-------------------->|
   |                  |                           |  commit             |
   |                  |                           |<--------------------|
   |  200 + expense   |                           |                     |
   |<---------------------------------------------|                     |
   |  GET /analytics/summary (Bearer JWT)         |                     |
   |--------------------------------------------->|  aggregate totals   |
   |                  |                           |-------------------->|
   |  200 + totals    |                           |<--------------------|
   |<---------------------------------------------|                     |

## Category seeding flow
- On first authenticated request for a user, backend seeds a default set of categories (Food, Transport, Groceries, Rent, etc.) if none exist.
- Seeding occurs inside the user-upsert transaction or right after to avoid duplicates.

## Budgets & analytics (Sprint 2)
- Budgets are defined per category or overall.
- Status endpoint computes spent and remaining using date windows (calendar month or custom period).
- Analytics endpoints aggregate by week/month and category; comparisons derive deltas vs previous period.

## Offline capture flow (Sprint 4)
- If offline, the Quick Add form writes to IndexedDB instead of sending a network request.
- A service worker (or foreground retry) syncs queued entries when online: reads entries, POSTs to `/expenses`, updates local store on success, and removes queued item.
- Conflict strategy: client entries are authoritative for new rows; server returns canonical IDs.

## Exports & email (Sprint 3)
- Export CSV: frontend requests a date range; backend streams CSV rows from Postgres.
- Email export: backend generates the CSV and sends via configured mailer. Dev mode writes the email to console or a local file.

## Imports (post-MVP)
- User uploads a CSV file (multipart). Backend stores a temporary file and returns a sample of rows for mapping.
- User posts a field mapping; backend processes rows, validating amount/date/category and inserting expenses in batches.

## Receipts (stretch)
- Frontend allows attaching an image to an expense.
- Backend accepts multipart upload, validates type/size, stores the file, and saves `receipt_url` on the expense.

## Security notes
- All API routes require Clerk JWT except public root.
- Data always filtered by `user_id` from token `sub`.
- CORS restricted to the frontend origin during dev.
- Amounts stored as integer minor units to prevent floating point errors.

## Observability (later)
- Add request logging and error tracking (e.g., structured logs).
- DB slow query logs to guide indexes.

## Config
- Backend `.env`
  - `CLERK_ISSUER=...`
  - `DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/smartspend`
- Frontend `.env.local`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...`
  - `NEXT_PUBLIC_API_BASE=http://localhost:8000`
