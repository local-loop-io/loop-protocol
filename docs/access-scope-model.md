# Access-Scope Model for Passport Data

localLOOP remains a lab-demo project with no public pilots or production deployments.
This document is data-modeling guidance, not an access-control implementation, not a
certification claim, and not legal advice. See the
[Regulatory Alignment Roadmap](regulatory-alignment-roadmap.md) for the broader context
this document narrows (Horizon 2, item 2).

## Why this exists

`passport.access_scope` (`public` / `role-based` / `restricted`) has existed since v0.2.0,
but "role-based" does not say which roles, and "restricted" does not say to whom. Several
regulations LOOP tracks draw a similar three-way line without naming it identically:

- The EU Batteries Regulation (EU) 2023/1542, Annex XIII, distinguishes data visible to
  the **general public**, to **actors with a legitimate interest** (e.g. remanufacturers,
  recyclers, market surveillance economic operators), and to **notified bodies and
  authorities**. As of this writing, the Article 77 implementing/delegated acts that would
  fix the exact mechanics of that tiering have not been adopted — the Regulation's own
  August 18, 2026 deadline for them has passed without adoption, with Commission
  publication now expected around Q4 2026. The three-tier shape in Annex XIII is stable;
  the access mechanics are not.
- DIWASS (the Digital Waste Shipment System under Regulation (EU) 2024/1157) exposes no
  public lookup at all — access is restricted to authenticated, pre-registered economic
  operators and competent authorities.
- The cross-sectoral EU Digital Product Passport Registry (Commission Implementing
  Regulation (EU) 2026/1778, live since July 20, 2026) deliberately indexes only unique
  identifiers and minimal metadata publicly; full passport content stays with the
  decentralized data carrier/holder, gated by whatever access rules apply to that specific
  product's delegated act. LOOP's node-held, reference-by-ID design is directionally
  compatible with that split.

None of this is settled enough to hard-code. What LOOP v0.2.0 can safely do — additively,
without touching `access_scope` or freezing on any one regulation's final mechanics — is
give implementers a shared vocabulary for expressing *intended* visibility, so payloads
crossing a lab federation carry a consistent hint instead of each node inventing its own.

## The three tiers

`passport.visible_to` (also available on `Transfer.passport`) takes one of:

| Tier | Rough audience | Regulatory echo |
|:-----|:----------------|:-----------------|
| `public` | Anyone, including an anonymous data-carrier scan | Battery Passport "general public"; ESPR DPP Registry's public index |
| `operator` | Supply-chain participants with a legitimate operational interest — node operators, manufacturers, recyclers, logistics and waste-management operators | Battery Passport "actors with a legitimate interest"; DIWASS's authenticated-operator access |
| `regulator` | Authorities, notified bodies, customs, market surveillance | Battery Passport "notified bodies and authorities"; DIWASS's competent-authority access |

The tiers are **cumulative**: `regulator` implies everything `operator` sees, which implies
everything `public` sees. `visible_to` names the *minimum* tier appropriate for a field or
payload — not an exact-audience list. If a node needs a genuinely non-cumulative split
(e.g., data visible to regulators but deliberately withheld from operators), that is
outside this model; use `access_scope: restricted` and handle it out of band.

`visible_to` refines `access_scope`, it does not replace it:

- `access_scope: public` pairs naturally with `visible_to: public`.
- `access_scope: role-based` should be paired with `visible_to: operator` or
  `visible_to: regulator` to say *which* role.
- `access_scope: restricted` can be paired with `visible_to: regulator` for the common
  case (authority-only), or omit `visible_to` when the restriction is case-by-case rather
  than tier-based.

## What this is not

LOOP's lab backend does not enforce `visible_to`. There is no field-level redaction, no
role-based auth on GET responses, and no per-tier payload filtering anywhere in
`localloop-backend` today — confirmed against the current source, not assumed. A node that
wants real enforcement has to build it; `visible_to` only gives that node's implementation
(and its federation peers) a common label to build on. Do not read `visible_to` on a
payload as a claim that access is actually controlled.

This is also independent of Core-DP's transport-layer auth modes
(`public-lab` / `bearer` / `node-signature` in `search-contract.schema.json`). Those
govern who can call an API at all; `visible_to` is a data-modeling hint about a field's
intended audience once a call is already authorized. A `bearer`-authenticated caller can
still receive a payload whose passport block is marked `visible_to: regulator` — the
schema does not stop that. Enforcing the match is implementation work outside this profile.

## Illustrative field-tier starting point

This table is a reasonable lab default, not a rule, and not exhaustive. Concrete
obligations depend on which regulation applies to a given material/product and on that
regulation's still-maturing implementing acts. Node operators remain responsible for their
own legal assessment.

| Tier | Typical fields | Why |
|:-----|:----------------|:----|
| `public` | `product_category`/`category`, `condition`, `name`/`model`, `passport_status`, `gtin`, `recycled_content_percent`, `recyclable_content_percent`, `repair_score`, `durability_score`, `carbon_footprint_kg_co2e`, `hazardous`, `material_safety_info_url`, `certifications` | Consumer-facing DPP content; a hazard flag and its safety-info link are public-interest by nature regardless of the rest of a passport's tier. |
| `operator` | `traceability.batch_id`, `lot_number`, `serial_number`, `source_operator_id`, `facility_id`, `chain_of_custody_url`, `epcis_event_refs`, `classification.*` codes | Supply-chain coordination data — useful to remanufacturers, recyclers, and logistics, not meaningful or necessary for a public consumer view. |
| `regulator` | `traceability.due_diligence_ref`, `document_refs`, `waste_shipment_doc_ref`, `passport.substances_of_concern` (full detail), `conformity_declaration_ref` backing evidence, evidence-log `retention`/`redaction_status` metadata itself | Compliance-evidence content — due-diligence and waste-shipment references point at documentation meant for authority review (see [Retention and Evidence Guidance](retention-and-evidence-guidance.md)), not general operational use. |

## Applying this to profiles

The [battery](../profiles/battery/README.md), [packaging](../profiles/packaging/README.md),
and [waste-shipment](../profiles/waste-shipment/README.md) extension guidance each note
where their regulation's own access tiers (where defined) map onto `public`/`operator`/
`regulator`, and where the underlying regulation has not yet fixed that mapping.

## Sources

- Batteries Regulation (EU) 2023/1542, Annex XIII: https://eur-lex.europa.eu/eli/reg/2023/1542/oj/eng
- Waste Shipment Regulation (EU) 2024/1157: https://eur-lex.europa.eu/eli/reg/2024/1157/oj/eng
- DIWASS: https://green-forum.ec.europa.eu/green-business/digital-waste-shipment-system-diwass_en
- Commission Implementing Regulation (EU) 2026/1778 (DPP Registry): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ%3AL_202601778
- DPP Registry go-live notice (July 20, 2026): https://single-market-economy.ec.europa.eu/news/digital-product-passport-registry-now-live-2026-07-20_en
