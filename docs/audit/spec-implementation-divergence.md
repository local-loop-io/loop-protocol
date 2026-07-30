# Protocol vs Implementation Divergence

> CURRENT-USE WARNING: This is a historical divergence snapshot, not current implementation or conformance evidence. Use [CLAIMS-AND-MATURITY.md](../governance/CLAIMS-AND-MATURITY.md) and [RELEASE-CHECKLIST.md](../governance/RELEASE-CHECKLIST.md) for current decisions.

**Original snapshot date (historical):** 2026-03-09

This document explicitly records known divergences between the LOOP specification (v0.1.1) and the current backend + docs hub implementations. It is intended to prevent ambiguity for contributors and reviewers.

## 1) API Surface

### Spec-required endpoints (v0.1.1)
The spec mandates `/api/v1/*` endpoints for core protocol operations.

| Spec Endpoint | Status | Current Backend Endpoint | Notes |
| --- | --- | --- | --- |
| `POST /api/v1/material` | Implemented | `/api/v1/material` | Lab-only endpoint; path aligned with the spec. |
| `GET /api/v1/material/{id}` | Implemented | `/api/v1/material/:id` | Read-by-id is available for lab materials. |
| `POST /api/v1/material/search` | Missing | — | Not implemented. |
| `GET /api/v1/node/info` | Partial | `/api/v1/node/info` | Implemented as a minimal lab metadata response; spec-style location/statistics fields are not exposed yet. |
| `GET /api/v1/signals` | Missing | — | Not implemented. |
| `POST /api/v1/transaction` | Missing | — | Not implemented. |
| `POST /api/v1/federate/announce` | Missing | `/api/v1/relay` | Relay is lab event log; not spec announcement. |
| `POST /api/v1/federate/offer` | Missing | `/api/v1/relay` | Relay is lab event log; not spec offer. |

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
- `/api/v1/relay` now limits relayed traffic to the current lab event/entity families, but it still does not validate cryptographic signatures or full spec announce/offer payloads.

## 4) Federation Handshake
- Spec documents federation endpoints (`/api/v1/federate/*`), while backend provides a lab-only registry at `/api/v1/federation/handshake`.
- Signature validation is **not** implemented; docs note signatures are placeholders.
- The handshake response now uses the preferred v0.2.0 context and schema version, but the endpoint path remains lab-specific.

## 5) Docs Hub vs Protocol Repo
- The docs hub mirrors protocol artifacts, but lag can occur if mirroring is not run after updates.
- Protocol OpenAPI artifact is now published as `loop-protocol/openapi.json` and mirrored at `https://localloop.urbnia.com/projects/loop-protocol/openapi.json` (corrected from a stale docs-hub path; canonical repo is `localloop-site`; see `DOMAIN-POLICY.md`).

## 6) Resolution Plan
- Keep documenting the lab-only compatibility surface until `/api/v1/material/search`, `/api/v1/signals`, `/api/v1/transaction`, and `/api/v1/federate/*` are implemented.
- Add signature validation if federation moves beyond controlled demos.
- Align auth model (Bearer token vs API key) and document deviations.
