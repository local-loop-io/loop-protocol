# Phase 2 - PRD/Requirements Evaluation

> CURRENT-USE WARNING: This is a historical audit snapshot, not current implementation or conformance evidence. Its original snapshot date and analyzed commits were not recorded in this source; do not infer them. It is a historical spec-feature evaluation and is superseded as the current requirements inventory by the Core-DP profile requirements at `loop-protocol/profiles/core-dp/requirements/core-dp-requirements.json`. Use [CLAIMS-AND-MATURITY.md](../governance/CLAIMS-AND-MATURITY.md) and [RELEASE-CHECKLIST.md](../governance/RELEASE-CHECKLIST.md) for current decisions.

## 2.1 Feature Matrix (Derived from `loop-protocol/SPECIFICATION.md`)

| Feature ID | Feature Name | PRD Status | Implementation Status | Completeness % | Notes |
| --- | --- | --- | --- | --- | --- |
| F-001 | MaterialDNA registration | Required | Partial | 50% | Implemented as lab demo `POST /api/v1/material`; search and broader discovery are still missing. |
| F-002 | Offer publication | Required | Partial | 50% | Implemented as lab demo `POST /api/v1/offer`; no offer discovery. |
| F-003 | Match acceptance | Required | Partial | 50% | Implemented as lab demo `POST /api/v1/match`. |
| F-004 | Transfer completion | Required | Partial | 50% | Implemented as lab demo `POST /api/v1/transfer`. |
| F-005 | Material lookup (GET by id) | Required | Implemented | 100% | `/api/v1/material/{id}` is available for lab material records. |
| F-006 | Material search | Required | Not implemented | 0% | `/api/v1/material/search` missing. |
| F-007 | Node info endpoint | Required | Partial | 60% | `/api/v1/node/info` now returns minimal lab node metadata; spec-style location/statistics fields are not implemented. |
| F-008 | LoopSignal config endpoint | Required | Not implemented | 0% | `/api/v1/signals` missing. |
| F-009 | Transaction creation | Required | Not implemented | 0% | `/api/v1/transaction` missing. |
| F-010 | Federation announce/offer | Required | Not implemented | 0% | `/api/v1/federate/announce` + `/offer` missing. |
| F-011 | Federation handshake protocol | Required | Partial | 40% | Implemented as `/api/v1/federation/handshake` (lab-only); no signature validation; schema differs from spec endpoint. |
| F-012 | LoopCoin issuance/transfer | Required | Not implemented | 0% | Schemas exist; no API/service implementation. |
| F-013 | LoopSignal voting | Required | Not implemented | 0% | Schemas exist; no API/service implementation. |
| F-014 | LoopCost calculation | Required | Not implemented | 0% | No routing/cost calculator implemented. |
| F-015 | Auth per spec (Bearer + TLS) | Required | Partial | 40% | API key + Better Auth optional; Bearer token support not enforced; TLS via proxy only. |
| F-016 | Lab data minimization (no PII) | Required | Partial | 30% | Loop schemas enforce structure; no explicit PII redaction checks. |

### Undocumented / Scope-Creep Features (Implemented but not in spec)
- S-001 Interest registry + SSE (`/api/interest`, `/api/interest/stream`)
- S-002 Payments intake (`/api/payments/intent`, `/api/payments/webhook`)
- S-003 City directory/geojson (`/api/cities`, `/api/cities/:slug`, `/api/cities/geojson`)
- S-004 Metrics counters (`/api/metrics`)
- S-005 Public privacy notice (`/api/privacy`)

## 2.2 API Contract Validation

### Spec vs Implementation (Backend)

| Method | Spec Endpoint | Implemented? | Closest Backend Endpoint | Notes |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/material` | ✅ | `/api/v1/material` | Lab-only payloads; path aligned. |
| GET | `/api/v1/material/{id}` | ✅ | `/api/v1/material/:id` | Implemented for lab material records. |
| POST | `/api/v1/material/search` | ❌ | `/api/interest?search=` | Search exists but only for interest registry (not protocol). |
| GET | `/api/v1/node/info` | ⚠️ | `/api/v1/node/info` | Minimal lab metadata exists; spec-style location/statistics are still missing. |
| GET | `/api/v1/signals` | ❌ | — | Missing. |
| POST | `/api/v1/transaction` | ❌ | — | Missing. |
| POST | `/api/v1/federate/announce` | ❌ | `/api/v1/relay` | Relay is lab-only event log, not spec announce. |
| POST | `/api/v1/federate/offer` | ❌ | `/api/v1/relay` | Same as above. |

### Backend Docs vs Actual Routes

| Method | Endpoint | Documented? | Implemented? | Notes |
| --- | --- | --- | --- | --- |
| GET | `/health` | ✅ (README) | ✅ | Root `AGENTS.md` says `/api/health` but code uses `/health`. |
| GET | `/api/cities/:slug` | ❌ | ✅ | Undocumented in README. |
| GET | `/openapi.json` | ✅ | ✅ | Swagger generated at runtime. |
| GET | `/docs` | ✅ | ✅ | Redoc HTML. |

### Missing Endpoints (Per Spec)
- `/api/v1/material/search` (POST)
- `/api/v1/signals` (GET)
- `/api/v1/transaction` (POST)
- `/api/v1/federate/announce` (POST)
- `/api/v1/federate/offer` (POST)

### Undocumented Endpoints (Per Implementation)
- `GET /api/cities/:slug`

## Divergence Documentation

- Explicit divergence summary: `docs/audit/spec-implementation-divergence.md`
- Protocol OpenAPI artifact: `loop-protocol/openapi.json` (mirrored to docs hub)
