# Waste-Shipment Extension-Guidance Conformance Vectors

This directory contains conformance vectors for `profiles/waste-shipment/README.md`'s documented
field mapping. Unlike `profiles/core-dp/conformance/`, there is no envelope, choreography, or
signing machinery here — each vector's payload is a `MaterialDNA` or `Transfer` record validated
directly against the pinned core v0.2.0 schemas, plus one profile-specific semantic check.

Run with `npm run conformance:waste-shipment` (from the repository root).

**Scope:** these vectors check that this profile's documented field usage is internally
consistent and schema-valid — not full LOOP conformance (see `profiles/core-dp/` for the lab
conformance profile) and not Waste Shipment Regulation / DIWASS compliance (see
[docs/governance/CLAIMS-AND-MATURITY.md](../../../docs/governance/CLAIMS-AND-MATURITY.md)). This
profile models no DIWASS/TRACES NT API integration or connectivity; `waste_shipment_doc_ref` is
checked here only as a URI-shaped reference field, never resolved or validated against DIWASS
itself.

This is a scaffold, not a certification program.
