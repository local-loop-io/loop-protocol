# RFC-0003: Schema Versioning Policy

- **Status**: Draft
- **Created**: 2026-03-08
- **Author**: Alphin Tom / Mycel UG (haftungsbeschränkt)

## Summary

This RFC documents the schema versioning policy established by LOOP v0.2.0. It defines how schema versions, JSON-LD contexts, and backward compatibility are managed across releases.

## Motivation

The v0.1.1 release introduced a split between six schemas versioned at `v0.1.1` and four schemas versioned at `v1`. The v0.2.0 release unifies all ten schemas under a single version line. This RFC formalizes the rules that govern future version changes.

## Policy

### Version line

All LOOP schemas share a single semantic version. The current version is `0.2.0`.

### Minor versions are additive

A minor version bump (e.g., 0.2.0 → 0.3.0) adds optional fields and types. It MUST NOT remove or rename existing required fields. Payloads valid under an earlier minor version MUST remain valid under the new version.

### Patch versions are corrective

A patch version bump (e.g., 0.2.0 → 0.2.1) fixes errata, tightens descriptions, or corrects patterns. It MUST NOT add new required fields or change the semantic meaning of existing fields.

### `schema_version` field

All schemas in the minimal interop flow (MaterialDNA, Offer, Match, Transfer, MaterialStatusUpdate, NodeHandshake) REQUIRE a `schema_version` field. The pattern `^0\.[1-9]\d*\.\d+$` accepts any `0.x.y` version.

Schemas outside the minimal interop flow (LoopCoin, LoopSignal, Transaction, NodeInfo) have `schema_version` as an OPTIONAL field.

### `@context` enum

All schemas accept both the v0.1.1 and v0.2.0 JSON-LD contexts via an `enum` constraint. Future versions will extend this enum. Older context URLs are never removed from the enum.

### Backward compatibility guarantee

- v0.1.1 payloads validate against v0.2.0 schemas (the `@context` enum includes v0.1.1, and the `schema_version` pattern accepts `0.1.1`).
- v0.2.0 payloads with DPP extension fields will not validate against v0.1.1 schemas (expected — extensions are additive).

### `additionalProperties`

All schemas set `additionalProperties: true` at the top level and in extension blocks (passport, classification, traceability, metadata). This allows receivers to preserve unknown fields when relaying payloads.

Schemas that previously used `additionalProperties: false` (the four v1 schemas) have been changed to `true` in v0.2.0 to match the additive-extension philosophy.

### JSON-LD context versioning

Each minor version release publishes a new JSON-LD context file (e.g., `loop-v0.2.0.jsonld`). Previous context files are never modified or removed. The new context is a superset of the previous one.

## Implementation

This policy is implemented in v0.2.0 by:
1. Unifying all 10 schema `$id` values under the `v0.2.0/` path.
2. Widening `schema_version` patterns to accept `0.x.y`.
3. Changing `@context` from `const` to `enum`.
4. Adding `schema_version` as optional to the four former-v1 schemas.
5. Setting `additionalProperties: true` on all formerly-closed definitions.

## References

- LOOP SPECIFICATION.md, Section 3.5
- LOOP CHANGELOG.md, v0.2.0 entry
