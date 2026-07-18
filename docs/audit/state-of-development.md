# State of Development

> CURRENT-USE WARNING: This is a historical audit snapshot, not current implementation, readiness, or claim evidence. Use [CLAIMS-AND-MATURITY.md](../governance/CLAIMS-AND-MATURITY.md) and [RELEASE-CHECKLIST.md](../governance/RELEASE-CHECKLIST.md) for current decisions. TD-001 and TD-002 are recorded below as **open as observed in this snapshot**; that does not resolve the conflicting historical observation in [technical-debt.md](technical-debt.md).

**Original snapshot date (historical):** 2026-03-09
**Historical analyzed commits:**
- localloop-backend: 21318e4 (branch `fix/ci-typecheck`)
- localloop.github.io: 937d35e (branch `fix/ci-domain-check`)
- loop-protocol: 4ba85b2 (branch `fix/domain-check-fallback`)
- org-github-profile: e130ac8 (branch `main`)
**Branch:** multi-repo

## Executive Summary

localLOOP is a multi-repo system with a clear lab-only posture: the protocol specification is mature enough to define a minimal interop flow, while the backend implements a limited demo API and the docs hub mirrors protocol artifacts. The documentation set is strong (specs, governance, compliance), but the protocol’s required API surface is largely unimplemented in the backend. The site and backend are aligned around lab demo flows and interest capture rather than full protocol compliance.

The primary blockers to production readiness are protocol/API alignment (spec endpoints, authentication semantics, and federation flows) and infra automation (resource limits, rollback, automated backups). Infrastructure hardening has begun (non-root execution, pinned images, health checks), and an OpenAPI artifact is now published for the protocol.

Recommended priorities are: implement or explicitly scope the protocol endpoints for v0.1.1, complete infra automation (backup scheduling + rollback runbook), and close the remaining gaps between spec and implementation.

### Health Indicators

| Metric | Status | Notes |
| --- | --- | --- |
| Feature Completeness | ~30% | Lab demo flow implemented; most spec endpoints missing. |
| Test Coverage | N/A | No coverage report; tests exist for backend routes + site e2e. |
| Technical Debt Items | 7 | 2 high, 4 medium, 1 low (see registry). |
| Production Readiness | 5/10 | Spec/API alignment + automation gaps remain; infra hardening partially addressed. |

---

## 1. Feature Implementation Status

### 1.1 Completed Features

| Feature | Implementation | Tests | Docs | Notes |
| --- | --- | --- | --- | --- |
| Interest capture + public list | ✅ | ✅ | ✅ | Non-protocol feature; SSE supported. |
| Docs hub (protocol mirror) | ✅ | ✅ | ✅ | Static export with mirrored spec artifacts. |

### 1.2 Partially Implemented

| Feature | Completeness | Blocking Issues | Priority |
| --- | --- | --- | --- |
| MaterialDNA → Offer → Match → Transfer (lab flow) | 50% | Spec endpoints missing; lab-only payloads | High |
| Federation handshake (lab registry) | 40% | No signatures, different endpoint path | High |
| Payments intake | 40% | No provider integrations, disabled by default | Medium |
| Auth (Better Auth) | 30% | Disabled by default; not wired to spec auth | Medium |

### 1.3 Not Started

| Feature | PRD Reference | Dependencies | Estimated Effort |
| --- | --- | --- | --- |
| Node info endpoint | Spec §8.1 | Response expansion (location/statistics) | S |
| Material search endpoint | Spec §8.1 | Search index + query API | M |
| LoopSignal config endpoint | Spec §8.1 | Data model + storage | M |
| Transaction endpoint | Spec §8.1 | Data model + settlement flow | L |
| Federation announce/offer endpoints | Spec §8.2 | Messaging + signature validation | M |
| LoopCoin issuance/transfer | Spec §5 | Ledger + rules | L |
| LoopSignal voting | Spec §6 | Governance flow | L |
| LoopCost calculation | Spec §7 | Algorithm + inputs | M |

---

## 2. Technical Debt Registry

### 2.1 Critical (Must Fix Before Production)

| ID | Location | Description | Impact | Effort |
| --- | --- | --- | --- | --- |
| — | — | None identified at code level | — | — |

### 2.2 High Priority

| ID | Location | Description | Impact | Effort |
| --- | --- | --- | --- | --- |
| TD-001 | `localloop-backend/deploy/localloop-backend.service` | Historical observation: non-root user configured but must be created/provisioned on VPS. | Security | S |
| TD-002 | `localloop-backend/src/config.ts` | Historical observation: defaults use `change-me` credentials if env missing. | Security | S |

### 2.3 Medium Priority

| ID | Location | Description | Impact | Effort |
| --- | --- | --- | --- | --- |
| TD-004 | `localloop-backend/src/storage/s3.ts` | Unused S3 client; feature incomplete. | Incomplete feature | M |
| TD-005 | `localloop-backend/src/metrics.ts` | In-memory metrics reset on restart. | Observability | S |
| TD-006 | `localloop-backend/src/routes/loop.ts` | `/api/v1/relay` accepts arbitrary payload. | Data quality | M |
| TD-007 | `localloop.github.io/public/assets/js/config.js` | Hardcoded API base; no env override. | Config flexibility | S |

### 2.4 Low Priority / Nice-to-Have

| ID | Location | Description | Impact | Effort |
| --- | --- | --- | --- | --- |
| TD-008 | `loop-protocol/docs/federation-handshake.md` | Placeholder signature guidance. | Spec clarity | M |

---

## 3. TODO/FIXME/FUTURE Inventory

### 3.1 Summary Statistics

- Total TODOs: 0
- Total FIXMEs: 0
- Total HACK/WORKAROUND: 0
- Total FUTURE/PLANNED: 0

### 3.2 By Category

No TODO/FIXME markers found in source files.

---

## 4. API Implementation Status

### 4.1 Endpoint Coverage (Backend)

| Method | Endpoint | Documented | Implemented | Tested | Auth |
| --- | --- | --- | --- | --- | --- |
| GET | `/health` | ✅ | ✅ | ✅ | None |
| GET | `/api/interest` | ✅ | ✅ | ✅ | None |
| POST | `/api/interest` | ✅ | ✅ | ✅ | API Key (optional) |
| GET | `/api/interest/stream` | ✅ | ✅ | ✅ | None |
| POST | `/api/v1/material` | ✅ | ✅ | ✅ | API Key (optional) |
| GET | `/api/v1/material/:id` | ✅ | ✅ | ✅ | None |
| GET | `/api/v1/material` | ✅ | ✅ | ✅ | None |
| GET | `/api/v1/node/info` | ✅ | ✅ | ✅ | None |
| POST | `/api/v1/offer` | ✅ | ✅ | ✅ | API Key (optional) |
| POST | `/api/v1/match` | ✅ | ✅ | ✅ | API Key (optional) |
| POST | `/api/v1/transfer` | ✅ | ✅ | ✅ | API Key (optional) |
| GET | `/api/v1/events` | ✅ | ✅ | ✅ | None |
| GET | `/api/v1/stream` | ✅ | ✅ | ✅ | None |
| POST | `/api/v1/relay` | ✅ | ✅ | ✅ | API Key (optional) |
| GET | `/api/v1/federation/nodes` | ✅ | ✅ | ✅ | None |
| POST | `/api/v1/federation/handshake` | ✅ | ✅ | ✅ | API Key (optional) |
| GET | `/api/cities` | ✅ | ✅ | ✅ | None |
| GET | `/api/cities/:slug` | ❌ | ✅ | ✅ | None |
| GET | `/api/cities/geojson` | ✅ | ✅ | ✅ | None |
| POST | `/api/payments/intent` | ✅ | ✅ | ✅ | API Key (optional) |
| POST | `/api/payments/webhook` | ✅ | ✅ | ✅ | API Key (optional) |
| GET | `/api/metrics` | ✅ | ✅ | ✅ | None |
| GET | `/api/privacy` | ✅ | ✅ | ✅ | None |
| GET | `/openapi.json` | ✅ | ✅ | ✅ | None |
| GET | `/docs` | ✅ | ✅ | ✅ | None |

### 4.2 Missing Endpoints (Per Spec)

- `/api/v1/material/search` (POST)
- `/api/v1/signals` (GET)
- `/api/v1/transaction` (POST)
- `/api/v1/federate/announce` (POST)
- `/api/v1/federate/offer` (POST)

### 4.3 Undocumented Endpoints

- `GET /api/cities/:slug`

---

## 5. Infrastructure & Deployment Status

### 5.1 Docker Configuration

| Aspect | Status | Notes |
| --- | --- | --- |
| Dockerfile optimization | ⚠️ | Single-stage; now runs as non-root with healthcheck. |
| docker-compose (dev/prod) | ⚠️ | One compose file; no env separation. |
| Health checks | ✅ | Health checks added for api/postgres/redis/minio. |
| Image pinning | ✅ | Redis/MinIO pinned by digest. |

### 5.2 Production Readiness Matrix

| Category | Status | Gaps |
| --- | --- | --- |
| Security | ⚠️ | Default creds, auth optional. |
| Logging | ⚠️ | No log shipping/rotation; Fastify logs only. |
| Monitoring | ⚠️ | Metrics are in-memory; no alerts. |
| Scaling | ⚠️ | Single-instance assumptions; no horizontal scaling plan. |
| Backup | ⚠️ | Manual runbook plus timer/script artifacts now exist; restore drill still pending. |

### 5.3 Required Infrastructure Work

1. Add log rotation / alerting and verify restore drills.
2. Wire offsite copy for the new scheduled backup job.

---

## 6. Test Coverage Analysis

### 6.1 Coverage Summary

| Type | Files | Covered | Coverage % |
| --- | --- | --- | --- |
| Unit | Backend route tests + validation | Partial | N/A |
| Integration | SSE + queue tests | Partial | N/A |
| E2E | Playwright on site | Partial | N/A |

### 6.2 Untested Critical Paths

- [ ] S3 storage integration (unused)
- [ ] Database migrations rollback behavior
- [ ] Auth flows when `AUTH_ENABLED=true`

### 6.3 Skipped Tests

None detected.

---

## 7. Dependency Analysis

### 7.1 Outdated Dependencies

Not assessed in this pass (no lockfiles for Bun/Next repos; loop-protocol not checked for outdated packages).

### 7.2 Security Vulnerabilities

- `loop-protocol`: `npm audit` reports **0 vulnerabilities** (2025-12-24).
- Other repos: not audited (no lockfiles).

### 7.3 Unused Dependencies

Not assessed; consider running `depcheck` per repo.

---

## 8. Recommended Action Plan

### Immediate (This Sprint)
1. [x] Document spec vs implementation divergence.
2. [x] Add non-root execution for Docker + systemd service.

### Short-term (Next 2-4 Weeks)
1. [x] Publish OpenAPI artifact for protocol.
2. [x] Add health checks + backup/restore runbook.

### Medium-term (1-3 Months)
1. [ ] Implement remaining core spec endpoints (Material search, Signals, Transactions, Federation announce/offer).
2. [ ] Implement LoopCost + LoopSignal/LoopCoin flows or mark as future scope.

---

## Appendices

### A. Full TODO List

No TODO markers found.

### B. Full FIXME List

No FIXME markers found.

### C. Configuration Files Inventory

- Root: `AGENTS.md`, `CLAUDE.md`
- `localloop-backend`: `Dockerfile`, `docker-compose.yml`, `tsconfig.json`, `.env.example`, `.env.docker.example`, `prisma.config.ts`
- `localloop.github.io`: `next.config.js`, `playwright.config.ts`, `scripts/check-domains.cjs`
- `loop-protocol`: `package.json`, `package-lock.json`, `scripts/validate-schemas.js`

### D. Environment Variables Reference (Backend)

| Variable | Description |
| --- | --- |
| PORT | API port (default 8088) |
| PUBLIC_BASE_URL | Public URL for OpenAPI `servers` |
| NODE_ID / NODE_NAME / NODE_CAPABILITIES | Lab node metadata |
| DATABASE_URL / DATABASE_SSL / DB_POOL_SIZE | Postgres config |
| REDIS_URL | Redis connection string |
| MINIO_ENDPOINT / MINIO_PORT / MINIO_ACCESS_KEY / MINIO_SECRET_KEY / MINIO_BUCKET / MINIO_USE_SSL | MinIO/S3 config |
| ALLOWED_ORIGINS | CORS allowlist |
| RATE_LIMIT_MAX / RATE_LIMIT_WRITE_MAX | Rate limit settings |
| RATE_LIMIT_WINDOW / RATE_LIMIT_WRITE_WINDOW | Rate limit windows |
| SSE_KEEPALIVE_MS / SSE_MAX_CLIENTS | SSE configuration |
| BODY_LIMIT | Request body size limit |
| RUN_MIGRATIONS / SEARCH_REFRESH_ON_WRITE | DB behavior |
| AUTH_ENABLED / AUTH_TRUSTED_ORIGINS / BETTER_AUTH_SECRET | Better Auth config |
| API_KEY_ENABLED / API_KEY | Optional API key protection |
| WORKER_ENABLED | Queue worker toggle |
| PAYMENTS_ENABLED | Payments endpoint toggle |
