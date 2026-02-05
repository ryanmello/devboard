# Refactor to Next.js UI + Go API

## Decisions locked in

- Repo layout: Go API at repo root, Next.js UI in `/ui`.
- Go stack: Gin framework for HTTP API.
- Auth: Supabase auth on frontend; send Supabase access token to backend; backend verifies JWT and authorizes requests; database is Supabase Postgres.

## Scope and target structure

- Move all UI code into `/ui`, including `app/`, `components/`, `hooks/`, `lib/`, `public/`, `styles`/`globals.css`, `types/`, and UI-specific config.
- Create Go API at repo root with a standard Gin layout.
- Replace Next.js API routes with Go endpoints, keeping parity with existing routes.

## Current files to anchor the refactor

- Existing UI entrypoints and API routes live under:
  - `[C:/Users/Ryan/Codebase/devboard/app](C:/Users/Ryan/Codebase/devboard/app)`
  - `[C:/Users/Ryan/Codebase/devboard/app/api](C:/Users/Ryan/Codebase/devboard/app/api)`
  - `[C:/Users/Ryan/Codebase/devboard/components](C:/Users/Ryan/Codebase/devboard/components)`
  - `[C:/Users/Ryan/Codebase/devboard/hooks](C:/Users/Ryan/Codebase/devboard/hooks)`
- Refactor plan will be written to:
  - `[C:/Users/Ryan/Codebase/devboard/REFACTOR.md](C:/Users/Ryan/Codebase/devboard/REFACTOR.md)`

## Plan to write into REFACTOR.md

### 1) Repo layout and tooling

- Move UI into `/ui` and update config paths:
  - `/ui/app`, `/ui/components`, `/ui/hooks`, `/ui/lib`, `/ui/public`, `/ui/types`, `/ui/globals.css`, `/ui/tailwind.config.ts`, `/ui/tsconfig.json`, `/ui/next.config.mjs`, `/ui/package.json`.
- Keep root `.gitignore`, `README.md`, and add a root-level `go.mod`, `go.sum`, `main.go`.
- Add root scripts for running UI and API in development (e.g. `npm` scripts that `cd ui` and `go run`), or a simple `Makefile`.

### 2) Go API bootstrap (Gin)

- Initialize Go module at repo root.
- Create baseline structure:
  - `/cmd/server/main.go` or root `main.go`
  - `/internal/api` (routers, handlers)
  - `/internal/middleware` (auth, logging)
  - `/internal/db` (GORM setup for Supabase Postgres)
  - `/internal/config` (env parsing)
- Add health endpoint and a `v1` router group.

### 3) Supabase auth and JWT verification

- Frontend: integrate Supabase auth using `@supabase/supabase-js` (or `@supabase/auth-helpers-nextjs` if SSR usage remains in `/ui/app`).
- Frontend: attach `Authorization: Bearer <access_token>` to requests to the Go API.
- Backend: verify JWT using Supabase project JWT secret or JWKS:
  - Validate signature, issuer (`supabase`), and token expiry.
  - Extract user ID (`sub`) and store in request context.
- Backend: reject unauthenticated requests with `401`.

### 4) Data access strategy

- Use GORM with the Postgres driver for Supabase Postgres, using the connection string from Supabase.
- Keep frontend database calls only when needed for UI-only read flows; otherwise route through Go API to centralize permissions.
- Define a clear boundary: UI calls Go API for writes and protected reads.

### 5) API route migration plan

- Inventory Next.js API routes under `/app/api` and map each to a Gin endpoint.
- For each route group, define:
  - Request/response schema (TypeScript types mirrored into Go structs).
  - Auth requirement (public vs authenticated).
  - DB access logic.
- Implement in Go and update UI fetchers to hit Go endpoints.

### 6) Environment and configuration

- Create `.env.example` at repo root and `/ui/.env.example` with:
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY` for UI.
  - `SUPABASE_JWT_SECRET` or JWKS config for API.
  - `SUPABASE_DB_URL` for Go.
  - `API_BASE_URL` for UI.
- Document local dev setup (Supabase project, local DB if desired).

### 7) Update documentation

- Update `[C:/Users/Ryan/Codebase/devboard/README.md](C:/Users/Ryan/Codebase/devboard/README.md)` to reflect new layout and dev commands.
- Populate `[C:/Users/Ryan/Codebase/devboard/REFACTOR.md](C:/Users/Ryan/Codebase/devboard/REFACTOR.md)` with the plan and checklist for each migration step.

## Risks and gaps to call out in the plan

- Ensure Supabase JWT verification uses the correct key path (project JWT secret vs JWKS).
- Confirm any server-side rendering needs in `/ui` that require auth-helpers.
- Migrate any Next.js API route-specific logic (file uploads, webhook handling) into Go equivalents.
- Decide if any endpoints should remain on the Next.js side (e.g., OAuth callbacks) and proxy to Go.

## Suggested order of execution

1. Create `/ui` and move UI code; fix build.
2. Bootstrap Go API with health endpoint.
3. Add Supabase auth in UI and JWT verification middleware in Go.
4. Migrate API routes incrementally; update UI fetchers.
5. Update README and REFACTOR.md checklist.