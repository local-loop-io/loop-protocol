# Regulatory Alignment Roadmap

LocalLoop remains a lab-demo project with no public pilots or production deployments.
This roadmap is a compatibility plan, not a certification claim and not legal advice.

## Why this roadmap exists

The LOOP Protocol now needs to stay additive and interoperable as EU product, packaging, battery, and waste-traceability rules become more digital.
The immediate goal is to make v0.1.1 payloads easier to extend without breaking existing lab integrations.

## Current baseline

- `v0.1.1` remains the emitter baseline for minimal interop payloads.
- Receivers should accept additive `0.1.x` patch releases when they can preserve or safely ignore unknown fields.
- Minimal interop payloads must stay free of personal contact data.
- Passport, classification, and traceability blocks are optional extension points, not required fields.

## Regulatory signals to track

### EU ESPR and Digital Product Passport

- Regulation (EU) 2024/1781 entered into force on July 18, 2024.
- The regulation establishes the Digital Product Passport framework and requires delegated acts to define product-specific rules.
- The first ESPR Working Plan for 2025-2030 prioritizes product groups including textiles, furniture, tyres, mattresses, iron and steel, and aluminium.
- Implication for LocalLoop:
  use additive passport identifiers, access-scope metadata, classification hints, and stable traceability references without hard-coding product-specific delegated-act fields too early.

### EU Batteries Regulation

- Regulation (EU) 2023/1542 entered into force on August 17, 2023.
- Digital battery passport obligations start applying from February 18, 2027 for light means of transport, industrial batteries above 2 kWh, and electric-vehicle batteries.
- Implication for LocalLoop:
  support passport IDs, battery category hints, due-diligence references, retention metadata, and role-based access boundaries.

### EU Packaging and Packaging Waste Regulation

- Regulation (EU) 2025/40 entered into force on February 11, 2025 and applies from August 12, 2026, with later phased obligations.
- Reusable transport packaging and grouped packaging will increasingly rely on harmonized identification and data-carrier requirements.
- Implication for LocalLoop:
  preserve packaging identifiers, reusable-loop references, and document links without assuming a single passport format yet.

### EU Waste Shipment and Traceability

- Regulation (EU) 2024/1157 entered into force on May 20, 2024.
- The move toward electronic documentation and stricter cross-border controls makes evidence references and retention windows more important.
- Implication for LocalLoop:
  keep document references, facility IDs, operator IDs, and retention dates attachable to material records and transfer events.

### Germany National Circular Economy Strategy

- Germany adopted the National Circular Economy Strategy in December 2024.
- The strategy emphasizes digital product information, reuse, repair, municipal circularity, and better data availability across value chains.
- Implication for LocalLoop:
  keep municipal-node interoperability, reusable material identity, and digital passport alignment as first-class design goals.

### GDPR and green claims governance

- GDPR Article 5 requires personal data to be adequate, relevant, and limited to what is necessary.
- Directive (EU) 2024/825 on empowering consumers for the green transition tightens how sustainability claims can be presented.
- The Green Claims proposal remains in legislative process as of March 7, 2026.
- Implication for LocalLoop:
  do not present protocol metadata as proof of compliance or environmental performance unless the required evidence and verification model exists.

## Delivery plan

### Horizon 1: now to 90 days

- Accept `application/ld+json` end-to-end in the backend.
- Remove PII-bearing fields from minimal interop payloads.
- Publish canonical versioned schema paths in the site mirror.
- Expand the JSON-LD context so additive fields expand predictably.
- Add sync and validation checks so protocol, backend copies, and site mirrors cannot silently drift.

### Horizon 2: 3 to 12 months

- Introduce profile-based extension guidance for battery, packaging, and waste-shipment use cases.
- Model access scopes for public, operator, and regulator-visible passport data.
- Add retention-policy and evidence-reference guidance for transfer and status events.
- Map current LOOP categories to product and waste classifications without freezing product-specific delegated-act structures too early.

### Horizon 3: 12 to 24 months

- Add conformance tests for additive patch releases and profile-specific extensions.
- Prototype adapter layers for battery passport and DPP service-provider integrations once implementing acts mature.
- Add reusable packaging and municipal reuse scenarios to lab flows.

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
- Batteries Regulation (EU) 2023/1542: https://eur-lex.europa.eu/eli/reg/2023/1542/oj/eng
- Packaging and Packaging Waste Regulation (EU) 2025/40: https://eur-lex.europa.eu/eli/reg/2025/40/oj/eng
- Waste Shipment Regulation (EU) 2024/1157: https://eur-lex.europa.eu/eli/reg/2024/1157/oj/eng
- Germany National Circular Economy Strategy: https://www.bmuv.de/en/topics/circular-economy/national-circular-economy-strategy
- GDPR Regulation (EU) 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng
- Empowering Consumers for the Green Transition Directive (EU) 2024/825: https://eur-lex.europa.eu/eli/dir/2024/825/oj/eng
- Green Claims proposal status page: https://eur-lex.europa.eu/legal-content/EN/HIS/?uri=CELEX:52023PC0166
