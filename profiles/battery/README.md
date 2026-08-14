# Battery Extension Guidance

**Status:** Extension guidance with scoped conformance vectors — not a full conformance
profile like `core-dp/`. This directory defines no schemas of its own; it documents how to
use fields that already exist in the pinned `SPECIFICATION.md` v0.2.0 schemas for
battery-related material and product flows. [`conformance/`](conformance/README.md)
(`npm run conformance:battery`) checks that this documented field usage validates against
the core schemas and is internally consistent — it does not check full LOOP conformance
(see `core-dp/` for that) and is not a conformance or compliance claim. localLOOP remains a
lab-demo project with no public pilots or production deployments. See
[CLAIMS-AND-MATURITY.md](../../docs/governance/CLAIMS-AND-MATURITY.md).

**Regulatory basis:** Regulation (EU) 2023/1542 (the Batteries Regulation). Digital
battery passport obligations start applying February 18, 2027, for light means of
transport (LMT) batteries, industrial batteries above 2 kWh, and electric-vehicle
batteries. As of this writing, the Article 77 implementing/delegated acts that would fix
the passport's exact format, data-access rights, and content missed their own August 18,
2026 statutory deadline and remain unadopted, with Commission publication now expected
around Q4 2026. Everything below maps existing v0.2.0 fields to the Regulation's known
shape; nothing here depends on Article 77's still-pending mechanics.

## Field mapping

| Battery Passport need | v0.2.0 field | Notes |
|:------------------------|:---------------|:------|
| Battery category (Annex I: portable / LMT / SLI / industrial / EV) | `classification.battery_category` (`material-dna.schema.json`) | Already an enum of exactly these five values. |
| Passport identifier and resolvable location | `passport.passport_id`, `passport.passport_url`, `passport.backup_copy_url` | `backup_copy_url` exists because the Regulation requires passport data to survive the economic operator's own discontinuation. |
| Data carrier reference (QR code or similar, physically on the battery) | `passport.data_carrier_id` | LOOP stores the carrier's *identifier*, not the carrier encoding itself; carrier format standardization (CEN/CENELEC EN 18220, adopted July 14, 2026 under Commission Implementing Decision (EU) 2026/1736) is a physical-labeling concern outside payload scope. |
| Economic operator identity | `passport.economic_operator_id`, `passport.economic_operator_name`, `passport.manufacturer_id`, `passport.country_of_production` | |
| Carbon footprint declaration | `passport.carbon_footprint_kg_co2e`, `passport.carbon_footprint_unit` | The Regulation eventually requires this per battery model/batch with a declared calculation methodology; LOOP carries the declared value only, not the methodology or verification chain. |
| Recycled content | `passport.recycled_content_percent` | **Known gap, deliberately not modeled further yet:** the Regulation phases in *per-substance* minimums (cobalt, lead, lithium, nickel) from 2028 onward. A single aggregate percentage cannot represent that breakdown. Nodes needing per-substance figures today can carry them under `metadata` (both `material-dna` and `product-dna` allow `additionalProperties: true` there) using their own key convention until this profile — or a future RFC — formalizes one. Do not treat a single `recycled_content_percent` as satisfying a future per-substance requirement. |
| Due diligence (supply-chain) documentation | `traceability.due_diligence_ref` | The due-diligence obligation itself was separately postponed to August 18, 2027 (Regulation (EU) 2025/1561), independent of the February 2027 passport-obligation start date — don't conflate the two dates. |
| Conformity / regulatory declarations | `passport.conformity_declaration_ref`, `conformity_claims[]` | `conformity_claims[].reference_regulation` can cite "Regulation (EU) 2023/1542" directly. |
| Hazard and safety information | `passport.hazardous`, `passport.material_safety_info_url` | Batteries are near-universally hazardous under transport/waste rules; set `hazardous: true` as the default expectation rather than an exception. |
| Verification / audit trail | `passport.verified_ratio`, `passport.verification_evidence_url` | |
| Marking this regime explicitly | `passport.supported_regimes: ["battery-passport"]` | |
| Audience tiering (public / legitimate-interest actors / notified bodies & authorities) | `passport.visible_to` (`public` / `operator` / `regulator`) | See [Access-Scope Model](../../docs/access-scope-model.md) — this is LOOP's own generalized three-tier vocabulary, chosen because it lines up directionally with Annex XIII's three-way split. It is not a literal implementation of Annex XIII, whose exact access mechanics are still pending in the Article 77 acts. |
| End-of-life material recovery | `MaterialDNA.category: ewaste-batteries` | The same physical battery moves from `ProductDNA` (in use, passport-bearing) to `MaterialDNA` (`ewaste-batteries`) at end of life — see [category-classification-mapping.md](../../docs/category-classification-mapping.md). |

## What this does not model

- Article 77's eventual binding data model. The field mapping above is deliberately kept
  at the level of "which existing v0.2.0 field carries this concept," not "here is the
  exact schema Article 77 will require." Provisional industry references worth tracking
  once Article 77 lands: the Battery Pass consortium's Data Attribute Longlist (v1.3, ~100
  fields, aligned to DIN DKE SPEC 99100:2025-02) and the IDTA/Catena-X Digital Battery
  Passport guideline (built on the Asset Administration Shell) — neither is an official EU
  schema as of this writing.
- Per-substance recycled/recovered content minimums (see table above).
- The "legitimate interest" qualification mechanics for Annex XIII's middle access tier —
  unadopted, per the implementing-act status above.
- Battery state-of-health / performance telemetry as a standardized time series. LOOP has
  no schema for this; a node could carry point-in-time values under `metadata` today, but
  this profile does not formalize one.

## Worked example

`examples/17-battery-passport-material.json` shows a `MaterialDNA` record for an
industrial battery pack at end of first use, with `classification.battery_category`,
`passport.supported_regimes`, and `traceability.due_diligence_ref` populated.

## Sources

- Batteries Regulation (EU) 2023/1542: https://eur-lex.europa.eu/eli/reg/2023/1542/oj/eng
- Critical raw materials due-diligence postponement, Regulation (EU) 2025/1561: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R1561
- Commission Implementing Decision (EU) 2026/1736 (CEN/CENELEC DPP standards incl. EN 18219/18220): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026D1736
- Battery Pass consortium: https://thebatterypass.eu/
- IDTA / Catena-X Digital Battery Passport guideline: https://industrialdigitaltwin.org/en/
