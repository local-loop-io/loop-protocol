# Locked Pilot Use Case: Municipal Reuse-Depot Interop

**Status:** Proposed (scope lock for outreach purposes). **Owner:** `alpha912`.
**Last reviewed:** 2026-08-14.

This document locks the single narrow use case localLOOP will describe in any
city-pilot outreach conversation, per [CLAIMS-AND-MATURITY.md](../CLAIMS-AND-MATURITY.md).
It exists so outreach never implies a broader surface than what is actually
implemented and evidenced today. Nothing in this document is an outward claim
by itself — see [PILOT-READINESS-CLAIM.md](PILOT-READINESS-CLAIM.md) for the
claim built on top of it.

## The locked use case

**A municipal reuse depot registers a batch of refurbished/reusable municipal
assets (e.g. office furniture) as `ProductDNA`, publishes an `Offer` to
redistribute the batch to a partner city or department, and records the
resulting `Match` and `Transfer` — all through the existing LOOP §8.1 REST
surface, against a single lab node.**

This is not a new feature. It is the existing "municipal-reuse" scenario
already implemented in `localloop-backend/scripts/simulate-lab.ts` (see the
block starting `// --- Municipal-reuse flow`) and already described publicly,
in the same bounded language used here, on the DEMO City page
(`localloop-site`, `/platform/demo-city/`: *"A city-run reuse-depot
`ProductDNA` flow... illustrating municipal-node interoperability"*).
Locking it means: **outreach and claims language may describe this flow and
no more**, until a subsequent evidence-backed expansion re-opens this
document.

### Why this flow, and not another

Four "real today" candidates were considered against the actual implemented
surface (`localloop-backend/docs/SPEC-COMPLIANCE.md`) and the regulatory
posture (`regulatory-alignment-roadmap.md`):

| Candidate | Real today? | Why locked in / out |
| --- | --- | --- |
| **Municipal reuse-depot** (`ProductDNA`→`Offer`→`Match`→`Transfer`) | Yes — implemented, runs end-to-end in `lab:demo`, zero PII fields | **Locked.** Tied to Germany's National Circular Economy Strategy (a standing policy emphasis on municipal circularity), not a specific EU delegated act — the lowest regulatory-drift risk of any candidate. Maps directly onto a city-government pilot partner (a depot is a municipal operation). |
| Reusable-packaging pooling cycle (PPWR-tagged `ProductDNA`) | Partially — flow runs, but PPWR's Art. 12 data-carrier format is not yet adopted (`regulatory-alignment-roadmap.md`, PPWR status update) | Out. A pilot claim here would sit on top of an unsettled implementing act; safer as a secondary/future scope, not the lead pilot story. |
| DIWASS waste-shipment adapter | No — explicitly "a data-shape prototype only, with no live transport" per the roadmap; no public sandbox exists | Out. Cannot be piloted with any real counterparty today regardless of city interest. |
| Battery Passport / ESPR DPP scenarios | No — gated behind Article 77 / first ESPR delegated acts, none adopted as of 2026-08 | Out. |

### What this use case explicitly excludes

Per the goal directive, no promise attaches to any of the following, and none
are part of the locked scope:

- **LoopCoin** — `POST /api/v1/transaction` is record-only persistence, no
  wallet/settlement engine (`SPEC-COMPLIANCE.md`, LoopCoin settlement lab
  boundary). No pilot claim will describe value transfer or settlement.
- **LoopSignal** — `GET /api/v1/signals` is seeded, read-only; no voting or
  proposal intake exists. No pilot claim will describe governance/voting.
- **LoopCost** — `MaterialDNA` carries no pricing field; `max_loop_cost`
  search filtering is rejected with `400 INVALID_REQUEST` by design. No pilot
  claim will describe cost matching or pricing.
- **Cross-node federation** — the municipal-reuse flow runs against a single
  lab node (two city labels, one node, confirmed by direct read of
  `simulate-lab.ts`: one `baseUrl` for both "DEMO Munich" and "DEMO Berlin"
  legs). `POST /api/v1/federate/*` and node-to-node `X-Node-Signature`
  cryptographic verification remain an intentional lab boundary
  (`SPEC-COMPLIANCE.md` §9.2). **A first pilot with one municipality does not
  require federation**, so this document does not ask item 2's work to wire
  envelope signing into the federation HTTP layer — see
  [PILOT-READINESS-CLAIM.md](PILOT-READINESS-CLAIM.md) for the explicit scope
  note and revisit trigger (a second real federated node).
- **DIWASS / Battery Passport / ESPR DPP regulatory conformance** — see table
  above. No pilot claim will assert conformance with any of these regimes.
- **Any production, deployment, or non-lab claim** — the pilot, if it
  proceeds, remains a lab demo per the project's Claims Policy
  (`CLAUDE.md`) until independently re-evidenced as such.

## What data actually moves (for DPIA/threat-model reassessment)

Two distinct data flows exist and must not be conflated:

1. **The reuse-depot flow itself** (`ProductDNA`, `Offer`, `Match`,
   `Transfer`): product category, name/description, condition, quantity,
   origin/current city labels, timestamps, route/mode. **No personal data.**
   Confirmed by direct read of the schema usage in `simulate-lab.ts` — no
   name, email, or individual-identifying field is populated anywhere in this
   flow.
2. **Public interest intake** (`POST /api/interest`, separate from the pilot
   flow above): optional name/email/organization — the only PII-bearing
   surface in the product, already scoped in `dpia-lite.md`. A real
   municipality's first contact with the project (before any pilot flow
   exists) goes through this surface, so the DPIA reassessment must cover
   both flows, not just the reuse-depot one.

## What a real pilot would still require that does not exist today

Documented honestly here so outreach conversations do not overstate
readiness beyond this document's own claim:

- **No city-facing data-entry UI.** Submitting real `ProductDNA`/`Offer`
  records today means direct authenticated API calls (`API_KEY_ENABLED`) or
  running/adapting the lab-demo script. There is no form, CSV import, or
  admin console for a non-technical depot operator. A pilot would need either
  a minimal intake UI or an integration point on the city's side.
- **No per-tenant isolation.** The lab node has no concept of "this city's
  data" vs. "that city's data" beyond the free-text city label fields; a real
  multi-city pilot would need to decide (and document) how city data is
  scoped, which is out of scope for this document and flagged here as an open
  question for whoever scopes an actual pilot agreement.
- **Auth is not yet proven end-to-end.** See
  [item 2 tracking](../../../../localloop-backend/docs/SPEC-COMPLIANCE.md) —
  `AUTH_ENABLED` (better-auth) is wired but had no runtime test coverage as
  of this document's last review; `API_KEY_ENABLED` is comprehensively
  tested. A pilot partner should be told which auth mode actually protects
  their data path.

## Revisiting this lock

This lock expires with [PILOT-READINESS-CLAIM.md](PILOT-READINESS-CLAIM.md)'s
own expiry. Re-open this document (not just the claim) if: the scope grows to
a second real node (federation), a real city's data enters the system (moving
status from Demonstrated to Operationally evidenced), or any excluded item
above needs to enter scope.
