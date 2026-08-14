# Battery Extension-Guidance Conformance Vectors

This directory contains conformance vectors for `profiles/battery/README.md`'s documented
field mapping. Unlike `profiles/core-dp/conformance/`, there is no envelope, choreography, or
signing machinery here — each vector's payload is a `MaterialDNA` or `ProductDNA` record
validated directly against the pinned core v0.2.0 schemas, plus one profile-specific semantic
check.

Run with `npm run conformance:battery` (from the repository root).

**Scope:** these vectors check that this profile's documented field usage is internally
consistent and schema-valid — not full LOOP conformance (see `profiles/core-dp/` for the lab
conformance profile) and not Battery Passport regulatory compliance or certification (see
[docs/governance/CLAIMS-AND-MATURITY.md](../../../docs/governance/CLAIMS-AND-MATURITY.md)).
Article 77's implementing/delegated acts remain unadopted; nothing here depends on their
still-pending mechanics.

This is a scaffold, not a certification program.
