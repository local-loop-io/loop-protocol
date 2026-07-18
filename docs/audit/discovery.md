# Phase 1 - Discovery & Context Gathering

> CURRENT-USE WARNING: This is a historical discovery snapshot, not current implementation, deployment, or readiness evidence. Its original snapshot date and analyzed commits were not recorded in this source; do not infer them. Use [CLAIMS-AND-MATURITY.md](../governance/CLAIMS-AND-MATURITY.md) and [RELEASE-CHECKLIST.md](../governance/RELEASE-CHECKLIST.md) for current decisions.

## 1.1 Project Structure Analysis

### Top-level layout
- Root contains four git repos plus shared `AGENTS.md` and `CLAUDE.md`.
- Repos:
  - `localloop.github.io` — public docs hub (Next.js static export).
  - `localloop-backend` — Bun + Fastify API (interest registry + lab demo).
  - `loop-protocol` — protocol specification + schemas + RFCs.
  - `org-github-profile` — GitHub org profile docs.

### Source directories
- `localloop.github.io`
  - `app/` — Next.js App Router pages and layouts.
  - `public/` — static assets + mirrored protocol content.
  - `scripts/` — domain checking + aggregation.
  - `tests/` — smoke + Playwright e2e.
- `localloop-backend`
  - `src/` — Fastify server, routes, DB, SSE, queue, schemas.
  - `prisma/` — schema and Prisma config.
  - `scripts/` — lab demo + federation simulations.
  - `tests/` — Bun test suite (routes, SSE, queue, auth).
  - `deploy/` — systemd + nginx example config.
- `loop-protocol`
  - `schemas/` — JSON schemas for core entities.
  - `contexts/` — JSON-LD contexts.
  - `docs/` — governance, security, implementation guidance.
  - `rfcs/` — RFC index and drafts.
  - `examples/` — JSON examples.
- `org-github-profile`
  - `profile/` — public org profile README.

### Key config files
- `localloop.github.io`
  - `package.json`, `next.config.js`, `playwright.config.ts`, `scripts/check-domains.cjs`
- `localloop-backend`
  - `package.json`, `tsconfig.json`, `Dockerfile`, `docker-compose.yml`, `.env.example`, `.env.docker.example`, `prisma.config.ts`
- `loop-protocol`
  - `package.json`, `package-lock.json`, `scripts/validate-schemas.js`

### Context files
- Root: `AGENTS.md`, `CLAUDE.md`
- `org-github-profile`: `AGENTS.md`, `CLAUDE.md`

### Requirements / PRD / Specs
- **No PRD or REQUIREMENTS.md found.**
- Primary requirements-like document: `loop-protocol/SPECIFICATION.md` (Protocol v0.1.1).

## 1.2 Documentation Inventory

### API documentation
- Backend runtime OpenAPI via Fastify swagger (`GET /openapi.json`, `GET /docs`).
- Protocol OpenAPI artifact: `loop-protocol/openapi.json` (mirrored in docs hub).

### Architecture docs
- No dedicated `ARCHITECTURE.md` found.
- Protocol docs: `loop-protocol/docs/implementation-guide.md` and security/compliance docs.

### Deployment docs
- Backend: `localloop-backend/Dockerfile`, `docker-compose.yml`, `deploy/localloop-backend.service`, `deploy/nginx.conf`.
- No Kubernetes manifests found.

### Developer guides
- `localloop.github.io/CONTRIBUTING.md`
- `localloop-backend/CONTRIBUTING.md`
- `loop-protocol/CONTRIBUTING.md`

## Tech Stack Summary
- **Frontend**: Next.js 16 (App Router), React 19, Playwright tests.
- **Backend**: Bun runtime, Fastify 5, Prisma 7, PostgreSQL (PostGIS), Redis + BullMQ, MinIO (S3).
- **Protocol**: JSON-LD + JSON Schema; AJV for schema validation.
- **Infra**: Docker + Traefik on VPS; optional systemd + Nginx config.
