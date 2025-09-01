# Frontend – Current State (as of Aug 8, 2025)

This app uses Next.js (App Router) with TypeScript, Tailwind, HeroUI, and Clerk for authentication.

## What’s working
- Routing/pages
	- Public: `/`, `/login`, `/signup`
	- Protected: `/dashboard` (gated by Clerk middleware)
- Auth
	- Login and Signup pages use Clerk components
	- `app/layout.tsx` wraps the app with `ClerkProvider` (uses `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
	- `middleware.ts` protects all non-public routes using `clerkMiddleware`
	- Dashboard fetches backend data with a Clerk JWT from `getToken({ template: "backend" })`
- UI
	- `Mainbar` + `MainPage` render a marketing-style landing page
	- Static assets are in `public/`
	- `app/providers.jsx` wires `HeroUIProvider`
- Tooling/config
	- ESLint, Tailwind, TS configured; `next.config.ts` minimal

## Key files
- `src/app/page.tsx` – landing page mounting `Mainbar` and `MainPage`
- `src/app/layout.tsx` – global layout + Clerk provider
- `src/app/dashboard/page.tsx` – protected page; calls backend `/dashboard`
- `src/app/login/[[...rest]]/page.tsx` – SignIn
- `src/app/signup/[[...rest]]/page.tsx` – SignUp
- `middleware.ts` – route protection with Clerk
- `src/app/providers.jsx` – HeroUI provider

## Environment variables needed (.env.local)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`
- Likely required for middleware/server-side: `CLERK_SECRET_KEY=sk_test_...`

In Clerk dashboard:
- Create a JWT Template named `backend`
- Ensure issuer matches backend `CLERK_ISSUER`

## How the dashboard talks to the backend
1) User signs in with Clerk
2) On `/dashboard`, we call `getToken({ template: "backend" })`
3) We `fetch('http://localhost:8000/dashboard', { Authorization: 'Bearer <token>' })`
4) Backend verifies the token against Clerk JWKS and returns a greeting

## How to run locally
1) Install deps and run dev server:
	 - `npm install`
	 - `npm run dev`
2) Open http://localhost:3000
3) Visit `/login` or `/signup`, then `/dashboard`

## What’s pending / next steps
- Confirm Clerk envs are present and middleware works end-to-end
- Add a lightweight API client that injects Clerk token for all calls
- Build first real features on `/dashboard` (e.g., list/add expenses)
- Error handling + loading states on fetches

## Pitfalls to watch
- If `/dashboard` shows auth errors, check:
	- JWT template name `backend`, matching issuer, RS256
	- `CLERK_SECRET_KEY` available for middleware
	- Backend running at `http://localhost:8000`
