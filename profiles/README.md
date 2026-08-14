# LOOP Applicability Profiles

Applicability profiles narrow the draft LOOP specification for a specific interoperability target without changing the base protocol schemas.

## Available Profiles

- `core-dp/`: Core-DP `0.1.0-lab`, a lab-only **conformance profile** for two controlled nodes. It maps every RFC 2119 normative clause in `SPECIFICATION.md` v0.2.0, classifies each clause as in scope, out of scope, or deferred, and includes conformance vectors for signed envelopes, DNA search, choreography, evidence, errors, version negotiation, and EPCIS fixture parsing.

### Regulatory extension guidance

The three directories below are **extension guidance with scoped conformance vectors, not
full conformance profiles** like `core-dp/`: they document how to use existing v0.2.0
fields for a specific regulatory use case, per the
[Regulatory Alignment Roadmap](../docs/regulatory-alignment-roadmap.md)'s Horizon 2 scope.
Each now also includes a lightweight conformance harness (Horizon 3) that checks the
profile's own documented field-usage claims — schema shape plus one or two grounded
cross-field rules — against the core schemas. None of the three defines its own schemas;
none claims full LOOP conformance or regulatory compliance.

- `battery/`: EU Battery Passport (Regulation (EU) 2023/1542) field mapping, with
  conformance vectors scoped to that mapping (`npm run conformance:battery`).
- `packaging/`: EU Packaging and Packaging Waste Regulation (PPWR, (EU) 2025/40) field
  mapping, with conformance vectors scoped to that mapping (`npm run conformance:packaging`).
- `waste-shipment/`: EU Waste Shipment Regulation / DIWASS ((EU) 2024/1157) field mapping,
  with conformance vectors scoped to that mapping (`npm run conformance:waste-shipment`).

Profiles do not imply production readiness, public pilot status, legal DPP certification, payment safety, or full LOOP conformance unless a profile states that explicitly.
