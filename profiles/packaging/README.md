# Packaging Extension Guidance

**Status:** Extension guidance, not a conformance profile. Like `battery/`, this directory
defines no schemas, conformance vectors, or harness of its own — it documents how to use
fields that already exist in the pinned `SPECIFICATION.md` v0.2.0 schemas for reusable and
grouped packaging flows. localLOOP remains a lab-demo project with no public pilots or
production deployments. See
[CLAIMS-AND-MATURITY.md](../../docs/governance/CLAIMS-AND-MATURITY.md).

**Regulatory basis:** Regulation (EU) 2025/40 (the Packaging and Packaging Waste
Regulation, PPWR). PPWR applied EU-wide from August 12, 2026, on schedule, with no general
delay. However, the Article 12 implementing act — which would define the harmonized
label and data-carrier format for reusable/grouped packaging — was itself due on that same
August 12, 2026 date and had **not** been adopted as of this writing. The Commission's
Guidance Notice C/2026/3084 (OJ June 10, 2026) is interpretive only and does not fix a
binding data-carrier format. Industry is converging informally around GS1 Digital Link
plus an ISO/IEC 18004 QR code, but this is not yet Commission-endorsed. This is the
sharpest case in this round of extension guidance for the roadmap's warning not to freeze
on unfinalized delegated-act structures: **there is currently no regulation-defined
packaging data carrier to map to.** What follows maps what PPWR does establish today.

## Field mapping

| PPWR need | v0.2.0 field | Notes |
|:-----------|:---------------|:------|
| Identifying an item as reusable/grouped packaging | `ProductDNA.product_category: "packaging-reusable"` | |
| Marking this regime explicitly | `passport.supported_regimes: ["ppwr"]` | |
| Passport-style identifier and resolvable location, once one is defined | `passport.passport_id`, `passport.passport_url`, `passport.data_carrier_id` | Populate `data_carrier_id` with whatever identifier scheme a node already uses (e.g., an internal pool-asset ID or a GS1 Digital Link the node has chosen ahead of the Commission's format) — LOOP does not prescribe the scheme, and this field should not be read as claiming conformance with the still-pending Art. 12 format. |
| Reusable-packaging pool / batch tracking | `traceability.batch_id`, `traceability.lot_number` | PPWR's reuse-rotation delegated act (due February 12, 2027, also not yet adopted) will eventually define minimum rotation counts for pooling systems. LOOP has no dedicated "reuse cycle count" field; a node tracking rotations today can use `metadata` (both schemas allow `additionalProperties: true` there) with its own key until the delegated act lands and this profile can formalize one against a concrete requirement instead of a guess. |
| Recycled content in packaging | `passport.recycled_content_percent` | Shared with the ESPR-style passport block; PPWR does not currently define a packaging-specific breakdown beyond what this field already carries. |
| Economic operator identity | `passport.economic_operator_id`, `passport.economic_operator_name` | Note: PPWR's own Extended Producer Responsibility (EPR) registers (Art. 44–47) are national, not EU-wide; a `passport.economic_operator_id` value is only as resolvable as the national register a receiving node has access to. An EPR-register-rules implementing act was open for public comment as of this writing (August–September 2026); watch for changes to how these registers interoperate. |
| Document evidence (conformity, compliance) | `passport.conformity_declaration_ref`, `conformity_claims[]` | |
| Audience tiering | `passport.visible_to` | See [Access-Scope Model](../../docs/access-scope-model.md). PPWR does not define its own public/operator/regulator split the way the Batteries Regulation's Annex XIII does; treat this as LOOP's generalized vocabulary, not a PPWR-specific requirement. |
| End-of-life / waste-stream classification | `MaterialDNA.classification.ewc_code`, `waste_framework_code` | Packaging waste commonly falls under List of Waste chapter 15 — see [category-classification-mapping.md](../../docs/category-classification-mapping.md). |

## What this does not model

- Any specific data-carrier encoding, physical label layout, or QR/GS1 Digital Link
  structure — none is yet Commission-defined (see above).
- Reusable-packaging pooling-system registries or minimum-rotation enforcement — PPWR's
  own delegated act for this (due February 12, 2027) is not adopted yet.
- The staggered PPWR obligations that apply later than the current baseline: material
  composition labeling (August 12, 2028), reusable-packaging QR labels and deposit-return
  system marking (February 12, 2029), and design-for-recycling/reuse-target rules
  (January 1, 2030) — each of these dates itself shifts if its own implementing act slips,
  as Article 12's already has.
- A single EU-wide registry for reusable-packaging economic operators — only national EPR
  registers exist today.

## Worked example

`examples/18-packaging-transfer.json` shows a `Transfer` payload for a reusable
transport-packaging unit moving between two nodes, with `traceability.batch_id` used as
the pooling-cycle identifier and `passport.supported_regimes` marking PPWR relevance.

## Sources

- Packaging and Packaging Waste Regulation (EU) 2025/40: https://eur-lex.europa.eu/eli/reg/2025/40/oj/eng
- PPWR application-date notice: https://environment.ec.europa.eu/news/new-eu-rules-packaging-enter-application-2026-08-11_en
- PPWR Guidance Notice C/2026/3084 (Art. 11/12 interpretation): https://eur-lex.europa.eu/eli/C/2026/3084/oj/eng
