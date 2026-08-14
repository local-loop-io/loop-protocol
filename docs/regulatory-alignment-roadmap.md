# Regulatory Alignment Roadmap

localLOOP remains a lab-demo project with no public pilots or production deployments.
This roadmap is a compatibility plan, not a certification claim and not legal advice.

## Why this roadmap exists

LOOP now needs to stay additive and interoperable as EU product, packaging, battery, and waste-traceability rules become more digital.
The immediate goal is to make v0.1.1 payloads easier to extend without breaking existing lab integrations.

## Current baseline

- `v0.2.0` is the current baseline with comprehensive DPP extension fields (ESPR, UNTP, PPWR, Battery Passport, NKWS-aligned). `v0.1.1` payloads remain valid.
- Receivers should accept additive `0.1.x` patch releases when they can preserve or safely ignore unknown fields.
- Minimal interop payloads must stay free of personal contact data.
- Passport, classification, and traceability blocks are optional extension points, not required fields.

## Regulatory signals to track

### EU ESPR and Digital Product Passport

- Regulation (EU) 2024/1781 entered into force on July 18, 2024.
- The regulation establishes the Digital Product Passport framework and requires delegated acts to define product-specific rules.
- The first ESPR Working Plan for 2025-2030 prioritizes product groups including textiles, furniture, tyres, mattresses, iron and steel, and aluminium.
- Implication for localLOOP:
  use additive passport identifiers, access-scope metadata, classification hints, and stable traceability references without hard-coding product-specific delegated-act fields too early.
- Status update (August 2026): no product-specific ecodesign delegated act has been adopted
  for any of the first-wave product groups. Iron and steel is furthest along (public
  consultation opened May 20, 2026; adoption indicative Q4 2026); textiles and aluminium
  are indicative 2027; furniture indicative 2028; mattresses indicative 2029 — later than
  this roadmap originally estimated. Separately, the cross-sectoral DPP Registry
  (Commission Implementing Regulation (EU) 2026/1778) went live July 20, 2026, indexing
  unique identifiers and metadata only — full passport content stays with the
  decentralized holder, which is directionally consistent with LOOP's own node-held,
  reference-by-ID design. CEN-CENELEC also published six of eight horizontal DPP
  standards (EN 18216 and EN 18219–18223) on May 27, 2026 under EC mandate M/604, cited as
  harmonised standards in the Official Journal on July 15, 2026. The remaining two (EN 18239,
  EN 18246 — access-rights/confidentiality and data-authentication/integrity) completed their
  formal CEN-CENELEC vote on July 16, 2026 and are now expected published around September
  2026, which would complete all eight M/604 standards. Source:
  https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en and
  https://eudigitalproductpassport.org/updates/cencenelec-dpp-standards
  Separately, UN/CEFACT's UNTP (the technical framework several LOOP passport fields are
  loosely inspired by — see field-level notes in the schemas) is itself still pre-v1.0: its
  v0.7.0 build finished public review July 13, 2026, with v1.0 targeted September 1, 2026.
  An independent CIRPASS-2-led review found UNTP "architecturally interoperable" with the
  CEN-CENELEC EN 18xxx family, though that stops short of formal EU legal adoption. LOOP's
  `conformity_topic` enum and `declared_value` shape are LOOP's own simplified design, not
  a field-for-field mirror of UNTP's (open-taxonomy `conformityTopic`,
  `assessedPerformance`) structures — treat any "UNTP-aligned" field description in the
  schemas as directional, not a conformance claim. Source: https://untp.unece.org/docs/specification/

### EU Batteries Regulation

- Regulation (EU) 2023/1542 entered into force on August 17, 2023.
- Digital battery passport obligations start applying from February 18, 2027 for light means of transport, industrial batteries above 2 kWh, and electric-vehicle batteries.
- Implication for localLOOP:
  support passport IDs, battery category hints, due-diligence references, retention metadata, and role-based access boundaries.
- Status update (August 2026): the February 18, 2027 application date is unchanged, but the
  Article 77 implementing/delegated acts that would fix the passport's format, data-access
  rights, and content missed their own August 18, 2026 statutory deadline and remain
  unadopted, with Commission publication now expected around Q4 2026. The separately
  postponed critical-raw-materials due-diligence obligation now starts August 18, 2027
  (Regulation (EU) 2025/1561) — do not conflate the two dates. See
  [profiles/battery](../profiles/battery/README.md) for the current field mapping and
  provisional industry references (Battery Pass consortium, IDTA/Catena-X).

### EU Packaging and Packaging Waste Regulation

- Regulation (EU) 2025/40 entered into force on February 11, 2025 and applies from August 12, 2026, with later phased obligations.
- Reusable transport packaging and grouped packaging will increasingly rely on harmonized identification and data-carrier requirements.
- Implication for localLOOP:
  preserve packaging identifiers, reusable-loop references, and document links without assuming a single passport format yet.
- Status update (August 2026): PPWR applied EU-wide from August 12, 2026 on schedule, with
  no general delay. However, the Article 12 implementing act defining the harmonized
  label and data-carrier format was itself due that same date and had not been adopted as
  of this writing (Commission Guidance Notice C/2026/3084, OJ June 10, 2026, is
  interpretive only). A draft implementing act was not expected until after summer 2026, with
  Waste Expert Group discussion and public consultation still to follow before adoption —
  putting realistic adoption closer to late 2026 or 2027 than a near-term date. This is the
  clearest current case for this roadmap's "without assuming a single passport format yet"
  guardrail. See [profiles/packaging](../profiles/packaging/README.md).

### EU Waste Shipment and Traceability

- Regulation (EU) 2024/1157 entered into force on May 20, 2024.
- The move toward electronic documentation and stricter cross-border controls makes evidence references and retention windows more important.
- The Digital Waste Shipment System (DIWASS) applies from May 21, 2026, mandating electronic processing of waste shipment notifications and documents.
- Implication for localLOOP:
  keep document references, facility IDs, operator IDs, and retention dates attachable to material records and transfer events. Support waste shipment document references in transfer payloads.
- Status update (August 2026): DIWASS went live on schedule (registration opened April 21,
  2026; the system itself May 21, 2026), running on the Commission's existing TRACES NT
  platform plus an API layer (Commission Implementing Regulation (EU) 2025/1290). A
  transition period allows Annex VII (Green List) shipment documents to still use paper
  through December 31, 2026. DIWASS exposes no public lookup — access is restricted to
  authenticated, registered operators and competent authorities. Confirmed retention
  figure: a minimum 5 years from the date the recovery/disposal completion certificate is
  issued. See [profiles/waste-shipment](../profiles/waste-shipment/README.md) and
  [Retention and Evidence Guidance](retention-and-evidence-guidance.md).

### Germany National Circular Economy Strategy

- Germany adopted the National Circular Economy Strategy in December 2024.
- The strategy emphasizes digital product information, reuse, repair, municipal circularity, and better data availability across value chains.
- Implication for localLOOP:
  keep municipal-node interoperability, reusable material identity, and digital passport alignment as first-class design goals.

### GDPR and green claims governance

- GDPR Article 5 requires personal data to be adequate, relevant, and limited to what is necessary.
- Directive (EU) 2024/825 on empowering consumers for the green transition tightens how sustainability claims can be presented.
- The separate Green Claims Directive proposal (COM(2023)166) had its final trilogue cancelled by the European Commission in June 2025 after the EPP and Italy withdrew support, and the Commission announced its intent to withdraw the proposal. As of this writing, no formal withdrawal has been confirmed as published in the Official Journal, so treat its status as dead in practice but procedurally not fully closed — avoid stating it as withdrawn without qualification. Directive (EU) 2024/825 on empowering consumers for the green transition remains the operative instrument, with Member State transposition due by March 27, 2026, and rules binding from September 27, 2026.
- Implication for localLOOP:
  do not present protocol metadata as proof of compliance or environmental performance unless the required evidence and verification model exists.
- Status update (August 2026): the March 27, 2026 transposition deadline passed with
  uneven Member State uptake (roughly 16-18 of 27 states had notified transposition
  measures around that date per the EUR-Lex National Implementation Measures tracker).
  The September 27, 2026 application date for binding substantiation rules is unchanged
  as of this writing — about six weeks from this roadmap's most recent update.

## City action timeline

The table below maps key regulation milestones to concrete planning checkpoints for city infrastructure owners. Dates are operative dates, not political agreement dates. This is informational only — not legal advice.

| Regulation | What applies | Operative date | City planning action |
|:-----------|:-------------|:---------------|:---------------------|
| DIWASS (WSR 2024/1157 Art. 26) | Electronic processing of cross-border waste shipment documents | **May 21, 2026 (now active)** | Confirm waste operators can submit and retrieve electronic shipment documents (Annex VII/Green List shipments may still use paper through December 31, 2026); verify document-reference fields are available in material-transfer records |
| PPWR (EU) 2025/40 | Reusable transport and grouped packaging identification | **August 12, 2026 (now active)** | Identify packaging categories in city procurement scope; ensure packaging identifiers can attach to material-transfer records. The Art. 12 harmonized data-carrier format is still pending (implementing act overdue) — do not commit to a specific label/data-carrier format yet |
| Green claims (Dir. EU 2024/825) | Sustainability claims presented to consumers | **September 27, 2026** | Review city-published material-flow or circularity statistics against tightened substantiation rules |
| ESPR DPP — iron & steel, textiles, aluminium, furniture | Digital Product Passports (first delegated acts) | **2027–2028, none adopted yet** | Assess procurement volumes for these categories; ProductDNA schema is DPP-aligned and ready for extension. Iron & steel is furthest along (consultation opened May 2026); the cross-sectoral DPP Registry is already live (July 20, 2026) for identifiers/metadata, ahead of any product-specific act |
| Battery Passport (EU) 2023/1542 | Digital passports for EV, light means of transport, and industrial batteries > 2 kWh | **February 18, 2027** | Audit city fleet and depots for in-scope battery categories; ensure asset management systems can store battery passport IDs. Art. 77 format/access acts missed their August 18, 2026 deadline (now expected ~Q4 2026) — treat exact data requirements as unconfirmed |

## Delivery plan

### Horizon 1: now to 90 days — complete

- Accept `application/ld+json` end-to-end in the backend.
- Remove PII-bearing fields from minimal interop payloads.
- Publish canonical versioned schema paths in the site mirror.
- Expand the JSON-LD context so additive fields expand predictably.
- Add sync and validation checks so protocol, backend copies, and site mirrors cannot silently drift.

### Horizon 2: 3 to 12 months — initial pass complete

- Introduce profile-based extension guidance for battery, packaging, and waste-shipment use cases (v0.2.0 provides UNTP DPP-aligned optional fields as a starting point). See [profiles/battery](../profiles/battery/README.md), [profiles/packaging](../profiles/packaging/README.md), [profiles/waste-shipment](../profiles/waste-shipment/README.md).
- Model access scopes for public, operator, and regulator-visible passport data. See [Access-Scope Model](access-scope-model.md) and the new `passport.visible_to` field (material-dna, product-dna, transfer schemas).
- Add retention-policy and evidence-reference guidance for transfer and status events. See [Retention and Evidence Guidance](retention-and-evidence-guidance.md); `localloop-backend`'s append-only evidence log now records a `status-updated` event for `MaterialStatusUpdate`, closing a gap where status changes reached only the mutable SSE feed.
- Map current LOOP categories to product and waste classifications without freezing product-specific delegated-act structures too early. See [Category-Classification Mapping](category-classification-mapping.md).

This pass is deliberately guidance- and metadata-only: no `schema_version` bump, no new
required fields, no `@context` change. All additions are optional properties inside
existing `additionalProperties: true` blocks, so v0.1.1 and v0.2.0 payloads that predate
this work remain valid without modification. Conformance tests for these three profiles
were added under Horizon 3 (see below).

### Horizon 3: 12 to 24 months — initial pass complete

- Add conformance tests for profile-specific extensions: `battery`, `packaging`, and
  `waste-shipment` each now have a scoped conformance harness (`npm run
  conformance:battery` / `:packaging` / `:waste-shipment`) checking that profile's own
  documented field-usage claims — schema shape plus one or two grounded cross-field rules —
  against the core v0.2.0 schemas. This is profile-specific conformance, not full LOOP
  conformance (see [profiles/core-dp](../profiles/core-dp/README.md) for that) and not a
  regulatory-compliance claim. See
  [profiles/battery/conformance](../profiles/battery/conformance/README.md),
  [profiles/packaging/conformance](../profiles/packaging/conformance/README.md), and
  [profiles/waste-shipment/conformance](../profiles/waste-shipment/conformance/README.md).
  Conformance for additive patch-release behavior itself (v0.1.1/v0.2.0 payload interop)
  continues to be covered by the existing example/schema validation in
  `scripts/validate-schemas.js`, run via `npm test`.
- Prototype an adapter layer for DIWASS specifically, ahead of Battery Passport or ESPR DPP,
  since DIWASS is the only regime tracked in this roadmap with a live (if access-gated)
  published API. `localloop-backend`'s `src/adapters/diwass/` maps LOOP `Transfer`/
  `MaterialDNA` waste-shipment fields to and from DIWASS-shaped document types (notification,
  movement, Annex VII reference, treatment-completion certificate) per the ID-format and role
  rules in Commission Implementing Regulation (EU) 2025/1290 Articles 10, 13, 14, and 15. This
  is a data-shape prototype only, with **no live transport**: DIWASS's API is SOAP/XML
  (Annex II), gated behind an existing DIWASS operator registration plus Commission
  Helpdesk-mediated credential issuance, with no public sandbox, test operator IDs, or
  published OpenAPI/WSDL — so a real network integration is not possible today, and the
  adapter does not attempt one. Battery Passport and ESPR DPP adapters remain deliberately
  un-built: they stay gated behind Article 77's still-unadopted implementing/delegated acts
  (expected ~Q4 2026, adopted piecemeal rather than as one act) and behind the first ESPR
  product-group delegated act (iron & steel furthest along, indicative Q4 2026 adoption)
  respectively — revisit once either lands.
- Add reusable-packaging and municipal-reuse scenarios to lab flows: `localloop-backend`'s
  `lab:demo` (`scripts/simulate-lab.ts`) now includes a reusable-packaging pooling-cycle flow
  (PPWR-tagged `ProductDNA`, see [profiles/packaging](../profiles/packaging/README.md)) and a
  municipal reuse-depot flow tied to the Germany National Circular Economy Strategy signal
  rather than a specific EU passport regime; `localloop-site`'s DEMO City page documents both
  as illustrative lab scenarios.

As with Horizon 2, this pass stays additive: no `schema_version` bump, no new required
fields, no `@context` change, and no new profile schemas — the three conformance harnesses
and the DIWASS adapter validate and map existing v0.2.0 optional fields; they do not add any.

### Horizon 4: 24 months and beyond

- Track product-specific delegated acts and standards as they are adopted.
- Promote stable extension profiles into normative schema modules only when rules are sufficiently concrete.
- Add machine-readable evidence and verification models before making any compliance-facing product claims.

## Design guardrails

- Preserve backward compatibility by keeping the v0.1.1 baseline payloads valid.
- Preserve forward compatibility by allowing additive patch-line versions and unknown extension fields.
- Keep regulated or sensitive attributes optional until a delegated act or standard makes them precise enough to model safely.
- Avoid embedding personal data in shared protocol payloads.
- Separate interoperability readiness from legal compliance claims in every public-facing document.

## Official sources

- ESPR Regulation (EU) 2024/1781: https://eur-lex.europa.eu/eli/reg/2024/1781/oj/eng
- ESPR Working Plan 2025-2030: https://environment.ec.europa.eu/publications/ecodesign-sustainable-products-and-energy-labelling-working-plan-2025-2030_en
- ESPR product-group delegated-act status and DPP Registry: https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en
- Commission Implementing Regulation (EU) 2026/1778 (DPP Registry): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ%3AL_202601778
- Commission Implementing Decision (EU) 2026/1736 (CEN/CENELEC DPP standards): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026D1736
- Batteries Regulation (EU) 2023/1542: https://eur-lex.europa.eu/eli/reg/2023/1542/oj/eng
- Critical raw materials due-diligence postponement, Regulation (EU) 2025/1561: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R1561
- Packaging and Packaging Waste Regulation (EU) 2025/40: https://eur-lex.europa.eu/eli/reg/2025/40/oj/eng
- PPWR application-date notice: https://environment.ec.europa.eu/news/new-eu-rules-packaging-enter-application-2026-08-11_en
- PPWR Guidance Notice C/2026/3084: https://eur-lex.europa.eu/eli/C/2026/3084/oj/eng
- Waste Shipment Regulation (EU) 2024/1157: https://eur-lex.europa.eu/eli/reg/2024/1157/oj/eng
- DIWASS go-live notice: https://environment.ec.europa.eu/news/new-waste-shipment-regulation-and-diwass-platform-go-live-2026-05-21_en
- DIWASS overview: https://green-forum.ec.europa.eu/green-business/digital-waste-shipment-system-diwass_en
- Germany National Circular Economy Strategy: https://www.bundesumweltministerium.de/en/topics/circular-economy/circular-economy-strategy
- GDPR Regulation (EU) 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng
- Empowering Consumers for the Green Transition Directive (EU) 2024/825: https://eur-lex.europa.eu/eli/dir/2024/825/oj/eng
- Green Claims proposal COM(2023)166 (trilogue cancelled June 2025; formal withdrawal not confirmed published): https://eur-lex.europa.eu/legal-content/EN/HIS/?uri=CELEX:52023PC0166
- Green Claims Directive National Implementation Measures tracker: https://eur-lex.europa.eu/legal-content/EN/NIM/?uri=oj%3AL_202400825
