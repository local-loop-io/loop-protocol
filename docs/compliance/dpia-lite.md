# DPIA Lite (Reassessed Against the Locked Pilot Scope)

**Status:** Lab baseline, reassessed. **Last reviewed:** 2026-08-14, against
[PILOT-USE-CASE.md](../governance/pilot-readiness/PILOT-USE-CASE.md) (the
municipal reuse-depot flow). This is not a certification, not legal advice,
and does not imply production readiness or an actual pilot deployment —
supersedes the prior generic version of this document, which described the
lab in the abstract rather than against a concrete data flow.

**Illustrative, not a named government.** "Municipality" below means a
realistic municipal-operator role (a city reuse-depot's facilities/public-works
staff), not any specific real city government. No real municipality's data
has entered the system as of this review — see
[PILOT-READINESS-CLAIM.md](../governance/pilot-readiness/PILOT-READINESS-CLAIM.md)
for what status that puts this flow at (Demonstrated, not Operationally
evidenced).

## Why this reassessment was needed

The prior version of this document described data categories and mitigations
in the abstract ("protocol payloads," "optional contact data") without
tracing an actual flow, and asserted a mitigation — "optional email
visibility and redaction" — that does not match what the code does (see Flow
1 below: it is conditional *inclusion*, not redaction). Reassessing against
one concrete pilot flow, tracing real endpoints and real tables, surfaces
risks a generic pass misses — most importantly, that enabling `AUTH_ENABLED`
(item 2 of this program) introduces a genuinely new personal-data store that
did not meaningfully exist as a live concern while that flag had zero
runtime coverage.

## The four data flows that actually exist

### Flow 1 — Public interest intake (`POST /api/interest`, `GET /api/interest`)

**Who:** anyone who fills out the public interest form — in a real pilot,
plausibly the first municipal contact (a procurement officer, sustainability
lead, or depot manager) expressing interest before any pilot flow exists.
**Data:** name, email, organization — all optional
(`src/routes/interest.ts`, `interestBodySchema`). **Storage:** `interests`
table. **Exposure control — verified, corrected from the prior version of
this document:** email is not redacted (partially masked); it is
*conditionally included* based on a per-submission `share_email` boolean set
by the submitter — `src/db/interest.ts`:
`CASE WHEN i.share_email THEN i.email ELSE NULL END AS email`. If
`share_email` is false, the email is never returned by `GET /api/interest`
or the SSE stream, at the SQL level, not filtered client-side. Name and
organization have no equivalent suppression — both are always returned if
provided (verify current behavior before treating this as unchanged; not
re-verified beyond `email` in this pass).
**Legal basis:** consent (the submitter chose to submit contact data).
**Retention:** no automated deletion; "delete on request" is a manual,
operator-performed action — no self-service deletion endpoint exists for
interest rows.
**Real risk:** a municipal contact who submits without setting
`share_email` still has name/organization publicly listed — worth an
explicit prompt or default change before any real outreach campaign
directs municipal contacts to this form.

### Flow 2 — Municipal reuse-depot pilot flow (`ProductDNA`→`Offer`→`Match`→`Transfer`)

**Who:** no individual data subject — this flow describes reused
municipal assets (e.g. office furniture), not people.
**Data:** product category, name/description, condition, quantity, city
labels, timestamps, route/mode (`scripts/simulate-lab.ts`, municipal-reuse
block). **Confirmed no personal data**: direct read of every field
populated in this flow contains no name, email, or individual-identifying
value. **Legal basis:** not applicable (no personal data). **Retention:**
governed by the separate evidence-log retention discussed in
[Retention and Evidence Guidance](retention-and-evidence-guidance.md), not a
DPIA concern in itself.
**Real risk:** low, for the flow as currently scoped. If a future extension
added a named human contact per depot (e.g. "submitted by") to `ProductDNA`
or `Offer`, that would move fields from this flow into Flow 1's risk
category — flag before adding any such field.

### Flow 3 — Operator authentication (`AUTH_ENABLED`, better-auth) — new in this reassessment

**Who:** whoever operates the pilot node on the municipality's behalf — a
depot staff member, IT contact, or the project maintainer acting on the
municipality's behalf during a pilot's early phase.
**Data (verified against the live schema, migration
`017_better_auth_schema.sql`):** `user` table — name, email (unique),
email-verified flag; `session` table — session token, **IP address, user
agent**, 7-day expiry (`Max-Age=604800` on the session cookie, confirmed by
live test); `account` table — a hashed credential (verified live: a stored
value 161 characters long, not equal to the plaintext password used to
create it — consistent with better-auth's scrypt-based hashing, not
independently audited beyond confirming it is not plaintext).
**Why this is new:** before item 2 of this program, `AUTH_ENABLED` had no
database schema applied at all and zero runtime coverage — there was no live
data path to assess. It is now real and tested
(`tests/auth.enabled.test.ts`).
**Legal basis:** legitimate interest / contractual necessity for operating
the pilot node (an operator account is not optional if `AUTH_ENABLED` is the
chosen protection mode for a pilot).
**Retention:** **no automated deletion path exists.** Session *cookies*
expire after 7 days, but the underlying `user`/`session`/`account` rows are
not automatically deleted — only a session ending, not account deletion.
Whether better-auth's default email+password plugin exposes a self-service
delete-user or password-reset endpoint at its default routes was **not
exhaustively verified in this pass** — treat manual, operator-performed
deletion as the current path until verified otherwise.
**IP address is personal data.** A `session.ipAddress` field capturing a
real operator's IP address on every sign-in is a data category the prior
DPIA never considered, because the flow was not functional. Any pilot that
enables `AUTH_ENABLED` must disclose this to the account holder.
**Real risk:** medium — this is now the single richest personal-data store
in the system (name + email + IP + user agent + session history for a named
individual), and it has no retention/deletion story yet. **Recommendation:**
before any real operator account is created for a pilot, define and
implement an actual deletion path (even a manual, documented one is
sufficient for a lab pilot) rather than leaving "delete on request"
unactionable for this flow specifically.

### Flow 4 — Append-only evidence log (derived from Flows 2 and 3's write paths)

**Who:** no new data subject beyond what the originating flow already
carries — evidence entries for Flow 2 writes carry no personal data, by
construction (Flow 2 carries none to log).
**Data:** event type, subject id/type, timestamp, retention/export
metadata — see [Retention and Evidence Guidance](retention-and-evidence-guidance.md)
for the full model. **Retention:** `retain_until` defaults to 2 years from
`recorded_at` (`src/db/evidence.ts`), a lab default, not a compliance-derived
figure.
**Real risk:** low for the locked pilot flow specifically, since Flow 2 has
no personal data to log.

## Security measures (verified, not asserted)

- TLS for transport (Traefik-terminated per `REPO_MANIFEST.md`; not
  re-verified at the certificate level in this pass).
- Request size limits and per-route rate limiting — confirmed present on
  `POST /api/interest` (`config: { rateLimit: writeRateLimit }`); not
  re-enumerated for every route in this pass.
- `AUTH_ENABLED` sessions: `HttpOnly`, `SameSite=Lax` cookies, confirmed live
  (`tests/auth.enabled.test.ts` / manual probe during this review).
- `API_KEY_ENABLED` guards the write surface used by Flow 2 — comprehensively
  tested per item 2 of this program (`tests/apiKey.routes.test.ts`).
- Audit logging: the append-only evidence log (Flow 4) covers Flow 2/3's
  write paths that already call `insertLoopEvidence`; it is not a general
  request log.

## Risks and mitigations (reassessed)

| Risk | Flow | Mitigation | Status |
| --- | --- | --- | --- |
| Municipal contact's name/organization published without an explicit prompt | 1 | `share_email` opt-in exists for email; no equivalent for name/organization | **Gap** — recommend before outreach campaign |
| Operator PII (name, email, IP, session history) has no deletion path | 3 | None automated today | **Gap** — recommend before any real pilot operator account is created |
| Over-collection in the pilot flow itself | 2 | Schema carries no personal-data fields by design | Mitigated, verified |
| Evidence log accumulating PII indirectly | 4 | Flow 2 (the only flow it logs for the locked pilot) carries no PII | Mitigated, verified for current scope; revisit if evidence coverage extends to Flow 1 or 3 |

## Review cadence

Reassess before: any real municipality's data enters Flow 1 or 3 for the
first time, any change to the locked pilot use case
(`PILOT-USE-CASE.md`), or 90 days from this review (2026-08-14), whichever
comes first — matching the default claim expiry in
[CLAIMS-AND-MATURITY.md](../governance/CLAIMS-AND-MATURITY.md).
