# Pilot-Readiness Claim: Municipal Reuse-Depot Interop

**Claim owner:** `alpha912`. **Review date:** 2026-08-14. **Reviewer:**
self (`alpha912`), under the [Solo-Operator Addendum](SOLO-OPERATOR-ADDENDUM.md).
**Expiry:** 2026-12-04 (CLAIMS-AND-MATURITY.md's 90-day default).
**Re-reviewed:** 2026-09-05 by `alpha912` (self, under the Solo-Operator
Addendum), superseding the 2026-09-04 interim re-review. Review record:

- *Scope check* — the claim still says only that an evidenced outreach
  conversation about the narrow reuse-depot flow is possible; no wording
  implies a pilot happened or that the platform is production-ready.
- *Evidence check* — every item in the table below points at merged,
  tagged, live code: `localloop-backend` v0.6.3 (`docs/SPEC-COMPLIANCE.md`
  now lists all four flow endpoints), `loop-protocol` v0.5.1 (§8.1 and
  `openapi.json` define offer/match/transfer), site v0.5.2 mirror. The
  earlier expiries (2026-09-13, then 2026-10-04) were shortened because the
  evidence sat in open pull requests; that no longer applies.
- *Disconfirmation check* — the 2026-09-04/05 estate sweep actively looked
  for evidence against the claim and found real defects on the pilot path
  that are now fixed and covered by tests: the duplicate-transfer 409→400
  regression in backend 0.6.1, an idempotency cache keyed on `key` alone, a
  pool-exhaustion path under concurrent keyed writes, and a nightly backup
  whose Redis snapshot was silently stale (`redis-cli SAVE` without auth).
  Record: `localloop-agent/LEDGER.md`, "Estate defect sweep". Nothing found
  contradicts the claim as worded; the fixes strengthen it.
- *Disclosure* — this remains a self-review (one active maintainer); see
  the addendum note below.

Original review 2026-08-14; original expiry 2026-09-13.

> This claim was reviewed under the Solo-Operator Addendum
> ([RFC-0005](../../../rfcs/0005-solo-operator-governance-override.md)):
> the project currently has one active maintainer, so no independent
> two-person governance review (as GOVERNANCE.md normally requires) has
> occurred. The evidence linked below is real and current as of the review
> date; the review itself is self-review only.

## What this claim says

**localLOOP is ready to have a concrete, evidenced outreach conversation
with a real municipality about a narrow pilot of the reuse-depot flow
locked in [PILOT-USE-CASE.md](PILOT-USE-CASE.md).** That is the entire
claim. It does not say a pilot has happened, that any real municipality's
data has entered the system, or that the platform is production-ready.

## Evidence-backed status per item (CLAIMS-AND-MATURITY.md vocabulary)

| Item | Status | Evidence |
| --- | --- | --- |
| Municipal reuse-depot flow (`ProductDNA`→`Offer`→`Match`→`Transfer`) | **Demonstrated** | Runs end-to-end against a real lab node: `localloop-backend/scripts/simulate-lab.ts` municipal-reuse block; all 4 endpoints (`POST /api/v1/product`, `/offer`, `/match`, `/transfer`) ✅ Implemented per `localloop-backend/docs/SPEC-COMPLIANCE.md`'s endpoint matrix (the offer/match/transfer rows were missing from the matrix until 2026-09-04, when they were added together with their §8.1/`openapi.json` definitions); response shapes validated in `tests/specResponses.test.ts`; cross-repo schema/mirror parity enforced by `tests/conformance.test.ts` (verified green in this session) |
| `API_KEY_ENABLED` protecting the pilot write surface | **Tested** | `tests/apiKey.routes.test.ts` — all 18 `requireApiKey` call sites covered except one low-priority conditional branch (search route's bearer-mode check), per the item-2 audit this claim is built on |
| `AUTH_ENABLED` (better-auth) | **Tested** as a standalone capability, **not integrated** | `localloop-backend` PR #99: schema provisioned (migration 017), real sign-up/sign-in/session tests (`tests/auth.enabled.test.ts`). **Explicit non-claim:** no business route checks a logged-in session — enabling this flag today adds zero protection to the pilot write surface itself (see Non-Claims below) |
| TD-002 credential-strength floor | **Tested** | Fixed same-day as this program began, commit `916a76b8`; `tests/config.security.test.ts`, 9 cases covering all 5 branches |
| Core-DP envelope signing / federation | **Explicitly out of scope**, not a gap | The locked pilot flow is single-node and doesn't use `/api/v1/federate/*` (confirmed by direct read of `simulate-lab.ts`); documented in `docs/SPEC-COMPLIANCE.md`'s pilot-scope note (PR #99). The underlying Ed25519 machinery exists and is tested for when a second real node is in scope |
| DPIA reassessment | **Demonstrated** (self-review, not external audit) | `loop-protocol/docs/compliance/dpia-lite.md`, rewritten 2026-08-14 against this pilot's actual data flows, PR #43 |
| Threat-model reassessment | **Demonstrated** (self-review, not external audit) | `loop-protocol/docs/compliance/threat-model.md`, rewritten 2026-08-14, PR #43 |
| Backup/restore drill | **Demonstrated**, explicitly **not Operationally evidenced** | `localloop-agent` `evidence/pilot-readiness-2026-08-14/backup-restore-drill.md` — real pg_dump/pg_restore (row-count + content-checksum match), Redis RDB save/restore, and object-storage tar backup/restore, all verified against scratch/ephemeral targets. **Local dev stack only** — a production VPS drill is an explicit open follow-up requiring a human operator, not claimed here. Also caught and fixed a real bug in the *actual* scheduled backup automation (`deploy/backup.sh`), not just the doc (PR #100) |
| Log retention | **Implemented** | `localloop-backend` PR #100: `docker-compose.yml` logging config on all 5 services, validated via `docker compose config` |
| Basic alerting | **Implemented**, not yet **Tested** in a real incident | `localloop-backend` PR #100: `deploy/healthcheck-alert.sh` + systemd timer; success/failure/degraded-parsing paths verified live in this session; no real production outage has occurred to alert on yet |
| Solo-operator governance process | **Implemented** | `loop-protocol` PR #42: RFC-0005, `SOLO-OPERATOR-ADDENDUM.md`, applied to this very claim |
| Locked pilot use case | **Implemented** | `loop-protocol` PR #42: `PILOT-USE-CASE.md` |
| Draft pilot terms | **Proposed**, explicitly not reviewed by counsel | `PILOT-TERMS.md` — not ready for signature (see its own header) |

**Open-PR caveat (why expiry is 30 days, not 90):** every backend and
protocol change above is a pushed, reviewable pull request as of the review
date (`localloop-backend` #99, #100; `loop-protocol` #42, #43, #44;
`localloop-site` #104) — real, inspectable, immutable-revision evidence per
CLAIMS-AND-MATURITY.md §2, but not yet merged (merge authority is
`alpha912`'s alone, per branch protection, and deliberately not exercised
by the autonomous session that opened them). If any PR is closed without
merging or is materially changed before merge, this claim's corresponding
row is invalid until re-reviewed.

## Non-claims (explicit — do not let a reader infer these)

- **No real municipality has been contacted, onboarded, or has submitted
  data.** Zero pilots exist. This claim licenses an outreach *conversation*,
  not a pilot in progress.
- **No per-operator write attribution.** Per the threat-model reassessment,
  the evidence log knows an event happened, not which authenticated person
  triggered it — `API_KEY_ENABLED` identifies a valid key holder, not an
  individual.
- **No per-tenant data isolation.** City labels are free text; nothing
  prevents one API key holder from writing records under any city name.
  Acceptable for a single-municipality pilot; a real requirement the moment
  a second real city is involved.
- **No production environment exists for this pilot.** The backup/restore
  drill and all testing in this program ran against the local development
  stack. Before any real municipal data enters the system, the parties must
  agree on and provision an actual pilot-hosting environment with its own
  verified backup arrangement (see `PILOT-TERMS.md` §2).
- **No legal review of `PILOT-TERMS.md`.** Not ready for signature.
- **No regulatory compliance, certification, or accessibility conformance
  claim** of any kind, for any regime tracked in
  `regulatory-alignment-roadmap.md`.
- **No LoopCoin, LoopSignal, or LoopCost claim**, per `PILOT-USE-CASE.md`'s
  explicit exclusions.

## Self-review checklist (per SOLO-OPERATOR-ADDENDUM.md)

- [x] **Scope check.** Every row above states the exact evidence-backed
      status, not a rounded-up label — e.g. `AUTH_ENABLED` is marked
      "Tested, not integrated" rather than just "Tested," specifically to
      prevent a reader inferring it protects the write surface.
- [x] **Evidence check.** Every row links a real artifact (PR, commit SHA,
      test file, or evidence doc) — none rest on a plan or unverified
      assertion.
- [x] **Disconfirmation check.** Actively looked for the strongest evidence
      against readiness before writing this: found and recorded the
      AUTH_ENABLED/API_KEY_ENABLED non-integration gap, the no-attribution
      and no-tenant-isolation gaps, the backup drill's local-only scope, and
      the open-PR status of every change — all included above rather than
      omitted.
- [x] **Metadata check.** Owner, evidence links, reviewer note, review date,
      and expiry are all present above.
- [x] **Cooling-off check.** This claim was drafted after, not during, the
      technical work it describes (items 1-5 and 7 were completed and
      independently verified in this session before this claim was
      written) — not a same-instant self-certification.
- [x] **Policy cross-check.** Checked against `CLAUDE.md`'s Claims Policy
      ("lab demo only" language) — this claim makes no pilot/production
      claim, only an outreach-readiness claim, consistent with that policy.
- [x] **Disclosure present.** See the block at the top of this document.

## What happens next (not part of the claim itself)

1. `alpha912` reviews and merges (or requests changes to) the linked PRs.
2. Outreach to an actual municipality can reference this claim,
   `PILOT-USE-CASE.md`, and the draft `PILOT-TERMS.md` (clearly marked
   draft) as the starting basis for a real conversation.
3. Before any real data enters the system: agree on a pilot-hosting
   environment and its own backup arrangement, get `PILOT-TERMS.md`
   reviewed by counsel, and decide whether `AUTH_ENABLED` needs to be wired
   to the write surface for that specific pilot's accountability needs.
