# Core-DP Conformance Harness Scaffold

This directory contains implementation-neutral conformance vectors for the lab-only Core-DP profile. Vectors are metadata-first: each vector links to one or more requirement IDs, declares an expected `valid` or `invalid` outcome, names the schema to use, and optionally requests deterministic semantic checks.

The repository validator currently checks:

- vector JSON shape and unique IDs;
- requirement links against the v0.2.0 normative manifest and Core-DP requirement index;
- expected valid/invalid outcomes;
- payload validation against the referenced JSON Schema;
- external receiver trust store (`trust/accepted-peer-keys.json`) schema conformance against `trust-store.schema.json`;
- required positive vector coverage for MaterialDNA register requests, ProductDNA read results, local Material search, cross-node Product search, choreography authority, retry duplicates, and final transfer convergence;
- deterministic envelope signing-input SHA-256, Ed25519 detached signatures (key resolved from external trust store), body-schema/message-type binding, and replay-window bounds;
- append-only evidence immutable subset consistency;
- search authorization/provenance semantics, including schema-level cross-node `node-signature` auth and eventual-consistency request requirements;
- DNA operation semantics;
- choreography authority role/node equality, retry/idempotency, stale-message, terminal-state, recovery overlays, and transfer-convergence semantics.

This is a scaffold, not a certification program.
