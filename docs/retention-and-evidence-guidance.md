# Retention and Evidence Guidance

localLOOP remains a lab-demo project with no public pilots or production deployments.
This document is informational guidance, not legal advice, and not a retention-policy
commitment. See the [Regulatory Alignment Roadmap](regulatory-alignment-roadmap.md)
(Horizon 2, item 3) for the broader context this document narrows.

## Two different things named "retention"

LOOP payloads and the Core-DP lab evidence log both carry a concept called retention.
They are related but not the same thing, and conflating them is the most common mistake
when wiring this up:

1. **`traceability.retention_until`** (on `MaterialDNA` and `Transfer`, v0.2.0) describes
   how long the *real-world record* — the due-diligence file, the waste-shipment
   documentation, the batch's chain-of-custody evidence — should be kept, per whatever
   regulation applies to that material or transfer. It travels with the payload as a
   plain data field. LOOP does not enforce it; it is a value the emitting node asserts.
2. **Evidence-entry `retention`** (`retain_until`, `exportable`, `redaction_status`,
   `redaction_reason` — Core-DP profile, `profiles/core-dp/schemas/evidence-entry.schema.json`)
   describes how long *the lab node's own append-only log entry* for a lifecycle event is
   kept before it may be marked exportable/non-exportable or redacted. It is
   infrastructure bookkeeping about the node's copy of the trail, enforced at the database
   level (`localloop-backend`'s `loop_evidence` table rejects `UPDATE`/`DELETE` outright;
   redaction is additive tombstoning, not rewriting).

A node that wants its evidence trail to actually outlive a regulatory retention
requirement needs to set (2) to be at least as long as the longest applicable (1) across
the records that evidence entry attests to. LOOP does not do this automatically — the two
fields live in different schemas maintained by different code paths, and nothing checks
them against each other today. Treat that as a node-level operational responsibility, not
a protocol guarantee.

## What the append-only evidence log now covers

The Core-DP evidence log (`GET /api/v1/evidence`, `GET /api/v1/evidence/:event_id`,
`POST /api/v1/evidence/search`) previously recorded `registered`, `offer-*`, `match-*`,
`transfer-*`, `error-recorded`, and `key-rotated` events. `MaterialStatusUpdate`
(`POST /api/v1/material-status`) was a gap: it only reached the mutable SSE feed
(`loop_events`), never the append-only trail, even though status changes (`available` →
`reserved` → `withdrawn`) are exactly the kind of fact a regulator or auditor might later
ask a node to substantiate.

`status-updated` is now a recognized `event_type` on `evidence-entry.schema.json` (subject
type `material`), and `localloop-backend` writes one on every material-status update
(`src/db/migrations/016_loop_evidence_status_updated.sql`). This is additive: existing
evidence entries and existing event-type values are unchanged, and a receiver that does not
recognize `status-updated` can ignore entries it doesn't understand exactly as it already
does for any other unfamiliar enum value.

This closes the literal gap named in the roadmap ("evidence-reference guidance for
**transfer and status events**") — transfer events already had full evidence coverage;
status events did not, and now do.

## Using `document_refs` and `due_diligence_ref` as evidence references

`traceability.document_refs` (array of URIs) and `traceability.due_diligence_ref` exist
specifically to let a payload point *at* evidence — a due-diligence report, a waste-shipment
notification, a certificate — without embedding it. This keeps payloads small and avoids
duplicating documents a node doesn't own. Two things worth being explicit about:

- These URIs are references, not proof of access. DIWASS, for example, exposes no public
  lookup for waste-shipment documents — a `waste_shipment_doc_ref` pointing at a DIWASS
  (TRACES NT) record is only resolvable by an authenticated, registered operator or
  competent authority. A `document_refs` entry being present in a LOOP payload does not
  mean every recipient of that payload can open it; combine with
  [`passport.visible_to`](access-scope-model.md) / a `regulator`-tier hint when the
  reference itself is sensitive.
- Prefer a stable reference (a document ID, a resolvable URL you control, or a hash under
  `epcis_event_refs.hash_digest`) over a raw file dump. `traceability.epcis_event_refs`
  already carries `hash_digest`/`hash_method` for exactly this — a receiver can verify a
  referenced document or event against the hash without the emitter re-sending it.

## Illustrative retention windows

These are the concrete figures found in official sources as of this writing. Where a
regulation's implementing act has not yet fixed a retention figure, this table says so
rather than guessing — do not treat an absence here as "no retention obligation exists,"
it means the mechanics are not yet published.

| Regime | Retention figure | Basis | Status |
|:-------|:------------------|:------|:-------|
| Waste Shipment Regulation / DIWASS | Minimum 5 years from the date the recovery/disposal completion certificate is issued | Regulation (EU) 2024/1157 (article number commonly cited as Art. 33; verify against the consolidated text before relying on it) | Confirmed in force since May 21, 2026. A paper-parallel transition for Annex VII (Green List) shipments runs through December 31, 2026. |
| EU Battery Passport due diligence | Not yet fixed in a published retention figure | Regulation (EU) 2023/1542, Art. 77 (format/access/content) | The due-diligence-specific postponement moved that obligation's own start to August 18, 2027 (Regulation (EU) 2025/1561); Art. 77's implementing/delegated acts, which would set retention mechanics for the passport itself, missed their own August 18, 2026 statutory deadline and are now expected around Q4 2026. |
| PPWR reusable-packaging records | Not yet fixed | Regulation (EU) 2025/40, Art. 12 (data carrier) | PPWR applies from August 12, 2026, but the Art. 12 implementing act was due that same date and had not been adopted as of this writing; Commission Guidance Notice C/2026/3084 (OJ June 10, 2026) is interpretive only. |
| ESPR / Digital Product Passport | Not centrally fixed — DPP Registry stores identifiers/metadata only | Regulation (EU) 2024/1781; Commission Implementing Regulation (EU) 2026/1778 | DPP Registry live since July 20, 2026. Full passport content and its retention stay with the decentralized holder under whichever product-specific delegated act eventually applies; none has been adopted yet for any product group as of this writing. |

For fields with no fixed regulatory figure yet, a lab node has two reasonable defaults to
choose between, neither of which is a compliance claim: keep evidence for as long as the
longest confirmed figure among regimes that plausibly apply (currently DIWASS's 5 years,
if waste-shipment-adjacent), or keep it indefinitely-by-default in the lab and revisit once
the relevant implementing act lands. `localloop-backend`'s current evidence-log default
(`retain_until` = 2 years from `recorded_at`, in `src/db/evidence.ts`) is a lab
implementation default, not a value derived from any of the above — treat it as a knob to
revisit per-deployment, not as guidance.

## Sources

- Waste Shipment Regulation (EU) 2024/1157: https://eur-lex.europa.eu/eli/reg/2024/1157/oj/eng
- DIWASS: https://green-forum.ec.europa.eu/green-business/digital-waste-shipment-system-diwass_en
- Batteries Regulation (EU) 2023/1542: https://eur-lex.europa.eu/eli/reg/2023/1542/oj/eng
- Critical raw materials due-diligence postponement, Regulation (EU) 2025/1561: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R1561
- Packaging and Packaging Waste Regulation (EU) 2025/40: https://eur-lex.europa.eu/eli/reg/2025/40/oj/eng
- PPWR Guidance Notice C/2026/3084: https://eur-lex.europa.eu/eli/C/2026/3084/oj/eng
- Commission Implementing Regulation (EU) 2026/1778 (DPP Registry): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ%3AL_202601778
