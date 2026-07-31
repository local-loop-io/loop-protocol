# Protocol vs Implementation Divergence

> CURRENT-USE WARNING: This is a historical divergence snapshot, not current implementation or conformance evidence. Use [CLAIMS-AND-MATURITY.md](../governance/CLAIMS-AND-MATURITY.md) and [RELEASE-CHECKLIST.md](../governance/RELEASE-CHECKLIST.md) for current decisions.
>
> **Partial refresh (2026-07-31, cycle 0045):** Spec §8 endpoint rows updated to reflect `localloop-backend` v0.4.0. For the authoritative live matrix see `localloop-backend/docs/SPEC-COMPLIANCE.md`.

**Original snapshot date (historical):** 2026-03-09

This document explicitly records known divergences between the LOOP specification (v0.1.1) and the current backend + docs hub implementations. It is intended to prevent ambiguity for contributors and reviewers.

## 1) API Surface

### Spec-required endpoints (v0.1.1)
The spec mandates `/api/v1/*` endpoints for core protocol operations.

| Spec Endpoint | Status | Current Backend Endpoint | Notes |
| --- | --- | --- | --- |
| `POST /api/v1/material` | Implemented | `/api/v1/material` | Lab-only endpoint; path aligned with the spec. |
| `GET /api/v1/material/{id}` | Implemented | `/api/v1/material/:id` | Read-by-id is available for lab materials. |
| `POST /api/v1/material/search` | Implemented | `/api/v1/material/search` | Dual protocol + Core-DP contract (v0.4.0). |
| `GET /api/v1/node/info` | Implemented | `/api/v1/node/info` | Canonical node-info schema validation (v0.4.0). |
| `GET /api/v1/signals` | Implemented | `/api/v1/signals` | LoopSignalConfig from seeded table (v0.4.0). |
| `POST /api/v1/transaction` | Implemented | `/api/v1/transaction` | Canonical transaction schema; responds TransactionStatus (v0.4.0). |
| `POST /api/v1/federate/announce` | Implemented | `/api/v1/federate/announce` | §9.2 headers enforced; 202 `{status, id}` (no canonical JSON-LD response schema). |
| `POST /api/v1/federate/offer` | Implemented | `/api/v1/federate/offer` | §9.2 headers enforced; material must be hosted locally (v0.4.0). |

### Implemented endpoints not in spec
| Backend Endpoint | Purpose | Notes |
| --- | --- | --- |
| `/api/interest` + `/api/interest/stream` | Public interest registry | Non-protocol feature. |
| `/api/cities` + `/api/cities/:slug` + `/api/cities/geojson` | Demo data | Lab UI support. |
| `/api/payments/*` | Manual payment intake | Disabled by default. |
| `/api/metrics` | In-memory counters | Observability for lab only. |
| `/api/privacy` | Lab data policy | Non-protocol. |

## 2) Authentication & Security
- Spec assumes Bearer token auth + TLS for protocol messages.
- Backend uses optional API key protection and optional Better Auth (disabled by default).
- TLS is provided via reverse proxy (Traefik/Nginx), not enforced in app logic.

## 3) Content-Type & Schema Enforcement
- Spec mandates `application/ld+json` and strict JSON-LD context usage.
- Backend lab endpoints accept JSON schemas but do not enforce `@context` values beyond schema-level `const` checks.
- `/api/v1/relay` remains a lab-only event log; spec announce/offer traffic uses `/api/v1/federate/*` (v0.4.0).

## 4) Federation Handshake
- Spec documents federation endpoints (`/api/v1/federate/*`), while backend provides a lab-only registry at `/api/v1/federation/handshake`.
- Signature validation is **not** implemented; docs note signatures are placeholders.
- The handshake response now uses the preferred v0.2.0 context and schema version, but the endpoint path remains lab-specific.

## 5) Docs Hub vs Protocol Repo
- The docs hub mirrors protocol artifacts, but lag can occur if mirroring is not run after updates.
- Protocol OpenAPI artifact is now published as `loop-protocol/openapi.json` and mirrored at `https://localloop.urbnia.com/projects/loop-protocol/openapi.json` (corrected from a stale docs-hub path; canonical repo is `localloop-site`; see `DOMAIN-POLICY.md`).

## 6) Resolution Plan
- Spec §8 openapi.json surface is implemented in `localloop-backend` v0.4.0; remaining work is hardening (signature verification) and out-of-scope flows (LoopCoin, LoopSignal voting, LoopCost).
- Add cryptographic signature validation if federation moves beyond controlled demos.
- Align auth model (Bearer token vs API key) and document deviations.
