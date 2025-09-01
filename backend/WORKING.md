# Backend – Current State (as of Aug 8, 2025)

FastAPI API that verifies Clerk-issued JWTs and exposes a minimal protected route for the frontend dashboard.

## What’s working
- Stack
	- FastAPI, Starlette, Uvicorn, python-jose for JWT, requests, python-dotenv
- CORS
	- Allows `http://localhost:3000` (frontend dev origin)
- Auth
	- Loads `CLERK_ISSUER` from environment
	- Fetches Clerk JWKS from `${CLERK_ISSUER}/.well-known/jwks.json`
	- Verifies `Authorization: Bearer <token>` using the matching JWK `kid`
- Endpoints
	- `GET /` → `{ "message": "Yo Buddy" }` (public)
	- `GET /dashboard` → protected; returns `Hello, <sub>` when token is valid

## Key files
- `main.py` – app, CORS, JWT verification helpers, and routes
- `requirements.txt` – pinned dependencies

## Environment variables needed (.env)
- `CLERK_ISSUER=https://<your-issuer>`
	- Example: `https://<tenant-id>.clerk.accounts.dev`

Ensure Clerk dashboard has a JWT template named `backend` with the same issuer and RS256 algorithm.

## How to run locally
1) Install dependencies:
	 - `pip install -r requirements.txt`
2) Start the server:
	 - `uvicorn main:app --reload --port 8000`
3) Quick checks:
	 - GET `http://localhost:8000/` → should return `Yo Buddy`
	 - GET `http://localhost:8000/dashboard` with a valid Clerk token → hello message

## Notes on JWT verification
- JWKS is fetched at import/startup; if offline or misconfigured, startup can fail
- Consider caching JWKS with refresh on 401 or at intervals
- Ensure token uses the `backend` template and issuer matches `CLERK_ISSUER`

## What’s pending / next steps
- Add persistence (SQLite/Postgres via SQLAlchemy) for expenses/budgets
- Define CRUD endpoints: expenses, categories, budgets
- Improve JWKS handling (cache + refresh, algorithm whitelist)
- Expand CORS if frontend runs on a different origin

## Pitfalls to watch
- 401s on `/dashboard` typically mean: wrong issuer, missing/expired token, or JWT template mismatch
- Import-time JWKS fetch can fail if Clerk is unreachable → move to lazy cached retrieval
- CORS must include your exact frontend origin
