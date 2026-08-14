# Waste-Shipment Extension Guidance

**Status:** Extension guidance, not a conformance profile. Like `battery/` and
`packaging/`, this directory defines no schemas, conformance vectors, or harness of its
own — it documents how to use fields that already exist in the pinned `SPECIFICATION.md`
v0.2.0 schemas for cross-border waste-shipment flows. localLOOP remains a lab-demo project
with no public pilots or production deployments. See
[CLAIMS-AND-MATURITY.md](../../docs/governance/CLAIMS-AND-MATURITY.md).

**Regulatory basis:** Regulation (EU) 2024/1157 (the Waste Shipment Regulation, WSR) and
the Digital Waste Shipment System (DIWASS) it establishes. DIWASS went live on schedule on
May 21, 2026 (registration opened April 21, 2026), running on the Commission's existing
TRACES NT platform plus an API layer defined by Commission Implementing Regulation (EU)
2025/1290. A transition period allows Annex VII (Green List) shipment documents to still
be handled on paper through December 31, 2026 — DIWASS is not yet a hard, universal
cutover for every shipment category. DIWASS exposes no public lookup; access is restricted
to authenticated, pre-registered economic operators and competent authorities.

## Field mapping

| WSR/DIWASS need | v0.2.0 field | Notes |
|:-------------------|:---------------|:------|
| Waste-shipment notification/movement document reference | `Transfer.waste_shipment_doc_ref` | Already a dedicated top-level field on `Transfer` — this is the most direct existing mapping in this entire round of guidance. Populate it with a stable reference into the shipping node's own DIWASS/TRACES NT record, not a copy of the document itself. |
| General evidence references | `traceability.document_refs` | Use alongside `waste_shipment_doc_ref` for supporting documents (e.g., pre-consent correspondence, financial guarantee references) that aren't the notification/movement document itself. |
| Due diligence on the shipment/operator | `traceability.due_diligence_ref` | |
| Operator and facility identity | `traceability.source_operator_id`, `traceability.facility_id` | These correspond to WSR's notifier/consignee and facility concepts, but LOOP does not validate them against any DIWASS or national operator register — they are asserted values. |
| Waste classification | `MaterialDNA.classification.ewc_code`, `waste_framework_code` | WSR shipment procedures (Green/Amber list, prior informed consent) turn on Basel/OECD and EWC-derived codes; see [category-classification-mapping.md](../../docs/category-classification-mapping.md) for candidate EWC chapters per LOOP `category`. |
| Retention of shipment documentation | `traceability.retention_until` | WSR sets a minimum 5-year retention from the date the recovery/disposal completion certificate is issued (commonly cited as Art. 33 — verify the article number against the consolidated text before relying on it). See [Retention and Evidence Guidance](../../docs/retention-and-evidence-guidance.md) for how this relates to the Core-DP evidence log's own, separate retention concept. |
| Marking this regime explicitly | `passport.supported_regimes: ["waste-shipment"]` (on `MaterialDNA`/`ProductDNA`) | |
| Audience tiering | `passport.visible_to` | See [Access-Scope Model](../../docs/access-scope-model.md). DIWASS's real access model (authenticated operators and competent authorities only, no public tier at all) maps most directly to this model's `operator`/`regulator` tiers — a waste-shipment record with a populated `waste_shipment_doc_ref` should generally not be marked `visible_to: public`. |

## What this does not model

- Any DIWASS/TRACES NT API integration. `waste_shipment_doc_ref` is a reference a human or
  downstream system resolves outside LOOP; this protocol does not call DIWASS, validate
  against it, or mirror its data.
- Prior informed consent (PIC) workflow state (notification submitted, consent granted,
  movement authorized, etc.) as a structured status. `MaterialStatusUpdate` and
  `Transfer.status` are LOOP's own generic lifecycle states and do not attempt to mirror
  WSR's procedural states.
- The Annex VII paper-parallel transition as a schema-level concept — whether a given
  shipment is still paper-eligible is a fact a node needs to track itself; LOOP has no
  field for "paper vs. electronic" because that is a procedural detail of the shipment,
  not a property of the material or transfer.
- Any Basel Convention/OECD control-code enumeration. `classification.ewc_code` and
  `waste_framework_code` stay free-text/pattern-validated rather than closed enums,
  deliberately, so this profile does not need to track Annex updates to stay valid.

## Worked example

`examples/19-waste-shipment-transfer.json` shows a `Transfer` payload for a cross-border
shipment of e-waste, with `waste_shipment_doc_ref`, `traceability.retention_until` set to
a 5-year window, and `classification.ewc_code` populated on the referenced `MaterialDNA`.

## Sources

- Waste Shipment Regulation (EU) 2024/1157: https://eur-lex.europa.eu/eli/reg/2024/1157/oj/eng
- DIWASS go-live notice (May 21, 2026): https://environment.ec.europa.eu/news/new-waste-shipment-regulation-and-diwass-platform-go-live-2026-05-21_en
- DIWASS overview and technical documentation: https://green-forum.ec.europa.eu/green-business/digital-waste-shipment-system-diwass_en
- Commission Implementing Regulation (EU) 2025/1290 (DIWASS interconnection/technical requirements): adopted July 2, 2025 — see the DIWASS overview page above for consolidated links.
