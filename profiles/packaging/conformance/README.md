# Packaging Extension-Guidance Conformance Vectors

This directory contains conformance vectors for `profiles/packaging/README.md`'s documented
field mapping. Unlike `profiles/core-dp/conformance/`, there is no envelope, choreography, or
signing machinery here — each vector's payload is a `ProductDNA`, `MaterialDNA`, or `Transfer`
record validated directly against the pinned core v0.2.0 schemas, plus one profile-specific
semantic check.

Run with `npm run conformance:packaging` (from the repository root).

**Scope:** these vectors check that this profile's documented field usage is internally
consistent and schema-valid — not full LOOP conformance (see `profiles/core-dp/` for the lab
conformance profile) and not PPWR regulatory compliance (see
[docs/governance/CLAIMS-AND-MATURITY.md](../../../docs/governance/CLAIMS-AND-MATURITY.md)).
PPWR's Article 12 data-carrier implementing act remains unadopted; nothing here assumes a
single packaging data-carrier format.

This is a scaffold, not a certification program.
