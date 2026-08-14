# Threat Model (Reassessed Against the Locked Pilot Scope)

**Status:** Lab baseline, reassessed. **Last reviewed:** 2026-08-14, against
[PILOT-USE-CASE.md](../governance/pilot-readiness/PILOT-USE-CASE.md) (the
municipal reuse-depot flow) and the four data flows walked through in the
companion reassessment, [dpia-lite.md](dpia-lite.md). This is not a
production security assessment. It supersedes the prior generic version of
this document, which analyzed "the LOOP Node API" as one undifferentiated
system rather than tracing its actual, distinct protection mechanisms.

## System boundaries (concrete, as of this review)

- **Public interest intake** (`POST /api/interest`, `GET /api/interest`,
  `GET /api/interest/stream`) — unauthenticated write, rate-limited.
- **LOOP v1 write surface** (`/api/v1/material`, `/product`, `/offer`,
  `/match`, `/transfer`, `/material-status`, `/relay`, plus federation and
  evidence-adjacent writes) — the pilot flow's actual data path. Guarded by
  `requireApiKey` (`API_KEY_ENABLED`) — a single shared secret per
  deployment, not a per-operator identity.
- **Operator authentication** (`/api/auth/*`, better-auth,
  `AUTH_ENABLED`) — session-based login. **Verified in this review: no
  business route anywhere in `src/routes/` checks a logged-in session as an
  authorization gate.** Only `src/routes/auth.ts` itself (the auth handler
  and its status endpoint) touches the `auth` object. This means, precisely:
  turning on `AUTH_ENABLED` adds real, tested authentication (item 2 of this
  program) but today adds **zero** additional protection to the pilot write
  surface above — that surface is protected by `API_KEY_ENABLED` alone, a
  completely separate mechanism. Do not describe `AUTH_ENABLED` to a pilot
  partner as protecting their data writes; it does not yet.
- **Append-only evidence log** — read-only HTTP surface, written internally
  only by the write routes above (`docs/SPEC-COMPLIANCE.md`, Evidence lab
  boundary).

## Assets (by flow, cross-referencing dpia-lite.md)

- Interest-intake contact data (Flow 1) — name, optional email/organization.
- Pilot flow payloads (Flow 2) — no personal data; asset value is
  integrity/availability of the reuse-depot record trail, not confidentiality.
- Operator credentials and session data (Flow 3) — name, email, IP address,
  user agent, session history, hashed credential.
- Append-only evidence entries (Flow 4) — integrity of the audit trail.

## Threats (STRIDE-lite, reassessed per flow)

| Threat | Concrete scenario (this system, today) | Mitigation | Status |
| --- | --- | --- | --- |
| **Spoofing** — interest intake | Anyone can submit as `mayor@anytown.gov` with no email ownership proof | None — email is never verified | **Open, low severity** (no privileged action follows from an interest submission) |
| **Spoofing** — pilot write surface | Any holder of the shared `API_KEY` can submit records claiming to be any city (`origin_city`/`current_city` are free text) | `API_KEY_ENABLED` proves *a* valid deployment credential, not *which* city/operator | **Open — real gap for a multi-city future**, acceptable for a single-municipality first pilot (see `PILOT-USE-CASE.md`'s "no per-tenant isolation" note) |
| **Spoofing** — operator identity | Sign-up accepts any email with no verification (`emailVerified: false` persists; nothing blocks use) | None configured | **Open** — do not rely on the email in a `user` row as a verified identity claim |
| **Tampering** — pilot flow payloads | Malformed/hostile `ProductDNA`/`Offer` payloads | JSON Schema validation + DB-level state-machine invariants (`SPEC-COMPLIANCE.md` §3.6) | **Mitigated, verified** |
| **Tampering** — evidence log | Attempt to alter a recorded event after the fact | `trg_loop_evidence_no_update`/`_no_truncate` DB triggers (migration 013) | **Mitigated, verified** |
| **Repudiation** — pilot writes | A depot operator later disputes having submitted a record | Evidence log records *that* an event happened and *when*, but — because `API_KEY_ENABLED` is shared and `AUTH_ENABLED` isn't wired to these routes (see System boundaries) — **does not record *which authenticated person* submitted it** | **Open — real gap.** A pilot needing per-operator accountability needs this wired before the claim can honestly say writes are attributable to a person, not just to "someone with the key" |
| **Repudiation** — operator sign-in | Operator disputes a session | `session` table records IP/user agent/timestamps per session | **Mitigated for session-level attribution**, not for Flow 2 write attribution (see above) |
| **Information disclosure** — interest data | Name/organization published without an equivalent to the `share_email` opt-in | Only email has a suppression control (`dpia-lite.md` Flow 1) | **Open — matches DPIA finding**, recommend before outreach |
| **Information disclosure** — operator PII | Session table's IP address is personal data with no retention/deletion path | None automated (`dpia-lite.md` Flow 3) | **Open — matches DPIA finding**, recommend before a real operator account is created |
| **Denial of service** — write routes | Flood of write requests | `writeRateLimit` confirmed configured on all 7 LOOP v1 write routes (`src/routes/loop.ts`) and on `POST /api/interest` | **Mitigated, verified** (rate-limit *thresholds* not load-tested in this pass) |
| **Elevation of privilege** — operator roles | A signed-up user attempts an admin-only action | Not applicable today: better-auth is configured with no role/permission model (`emailAndPassword: { enabled: true }` only) and, per above, no route checks the session at all | **Not a live risk today** (no route depends on role), but also means auth currently grants no privilege distinction if a route is later wired to it without adding roles — flag for whoever wires it |

## Residual risk (reassessed, not generic)

Two concrete, verified gaps carry forward into any real pilot conversation:

1. **No per-operator write attribution.** `AUTH_ENABLED` and
   `API_KEY_ENABLED` are two independent mechanisms; only the latter guards
   the pilot's actual write surface, and it identifies "a valid key holder,"
   not a person. If a pilot needs to say "we know which named individual
   submitted this record," that is not true today and would need real
   integration work (route-level session checks plus evidence-log
   attribution fields), not just enabling both flags.
2. **No per-tenant data isolation.** City labels are free text; nothing
   prevents one API key holder from writing records under any city name.
   Acceptable for a single-municipality pilot (nothing to isolate *from*
   yet); becomes a real requirement the moment a second real city is
   involved.

Both are carried into
[PILOT-READINESS-CLAIM.md](../governance/pilot-readiness/PILOT-READINESS-CLAIM.md)
as explicit non-claims — the claim does not assert per-operator
accountability or multi-tenant isolation, because neither is true.

## Review cadence

Same trigger as `dpia-lite.md`: reassess before any real municipality's data
enters the system, before any change to the locked pilot use case, or 90
days from 2026-08-14, whichever comes first.
