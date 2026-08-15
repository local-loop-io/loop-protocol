# Changelog

All notable changes to the LOOP specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Solo-operator governance override: `rfcs/0005-solo-operator-governance-override.md`
  and `docs/governance/pilot-readiness/SOLO-OPERATOR-ADDENDUM.md`. GOVERNANCE.md's
  two-person quorum was written for a 3-5 person project and, as literally written,
  has no path for a genuinely solo maintainer — its own bootstrap exception keeps
  releases and high-risk claims blocked until a second person independently
  approves. The addendum narrowly supersedes the quorum/independent-reviewer
  requirements in GOVERNANCE.md §2/§4 and CLAIMS-AND-MATURITY.md §3 — and nothing
  else — with a mandatory self-review checklist, a recorded rationale, and a
  mandatory public disclosure on every claim made under it. Sunsets automatically
  once a second maintainer is appointed. A pointer was added to GOVERNANCE.md §4
  itself so the override is discoverable from the document it narrows.
- `docs/governance/pilot-readiness/PILOT-USE-CASE.md`: locks the single pilot
  scope for city-outreach conversations to the existing municipal reuse-depot
  flow (`ProductDNA`→`Offer`→`Match`→`Transfer`), chosen over reusable-packaging/
  DIWASS/battery-passport candidates for lowest regulatory-drift risk. Explicitly
  excludes LoopCoin/LoopSignal/LoopCost and cross-node federation.
- `docs/governance/pilot-readiness/PILOT-READINESS-CLAIM.md`: the outward
  pilot-readiness claim, evidence-backed status per item (not a blanket
  "ready"), reviewed under the solo-operator addendum, with an explicit
  non-claims section and a 30-day expiry.
- `docs/governance/pilot-readiness/PILOT-TERMS.md`: draft pilot terms —
  liability, data handling, lab-pilot framing, exit criteria — explicitly
  marked not legal advice and not ready for signature.

### Changed
- `docs/compliance/dpia-lite.md` and `docs/compliance/threat-model.md`
  rewritten from generic lab-baseline boilerplate to a reassessment against
  the locked pilot flow's actual data paths. Corrected a stale claim
  (dpia-lite.md previously described email "redaction"; the real mechanism
  is conditional inclusion via a `share_email` opt-in flag). Surfaced that
  enabling `AUTH_ENABLED` introduces a new PII store (name/email/IP/session
  history) with no deletion path yet, and that no route ties a write to a
  specific authenticated person — both carried forward as explicit
  non-claims in `PILOT-READINESS-CLAIM.md`.

### Fixed
- `docs/backup-restore-runbook.md` referenced the retired `minio`
  service/`data/minio` path (renamed to `seaweedfs` at some prior point in
  `localloop-backend`'s `docker-compose.yml`); following it literally would
  have failed at the object-storage backup step. Caught by an actual
  backup/restore drill, not a documentation read — see
  `localloop-agent` `evidence/pilot-readiness-2026-08-14/backup-restore-drill.md`.

### Added
- Horizon 2 of the regulatory alignment roadmap (profile-based extension guidance, access
  scopes, retention/evidence guidance, category-classification mapping). All additions are
  optional fields inside existing `additionalProperties: true` blocks — no `schema_version`
  bump, no new required fields, no `@context` change; v0.1.1 and v0.2.0 payloads remain
  valid unchanged.
- `passport.visible_to` (`public` / `operator` / `regulator`) on `material-dna`,
  `product-dna`, and `transfer` schemas — a cumulative audience-tier hint that refines
  `access_scope` without replacing it. See `docs/access-scope-model.md`.
- `docs/access-scope-model.md`, `docs/retention-and-evidence-guidance.md`, and
  `docs/category-classification-mapping.md`.
- `profiles/battery/`, `profiles/packaging/`, `profiles/waste-shipment/` — extension
  guidance (not conformance profiles) mapping existing v0.2.0 fields to the EU Battery
  Passport, PPWR, and Waste Shipment Regulation/DIWASS respectively.
- Examples 17-19: `17-battery-passport-material.json`, `18-packaging-transfer.json`,
  `19-waste-shipment-transfer.json`.
- `status-updated` event type on the Core-DP `evidence-entry.schema.json` (subject type
  `material`), so `MaterialStatusUpdate` changes reach the append-only evidence log
  instead of only the mutable SSE feed. `localloop-backend` migration
  `016_loop_evidence_status_updated.sql` widens the corresponding `CHECK` constraint.

### Changed
- Consolidated the 21 per-cycle `check-cycle-NNN.js` guards into a single
  data-driven `scripts/check-agent-markers.js`. Cycles 035-040 and 027 pinned a
  documentation anchor to a specific file and are preserved as a marker table;
  cycles 042-098 only re-asserted that `examples/` was non-empty, which
  `validate-schemas.js` already covers more strictly.
- Documented `npm run test` as the validation entrypoint instead of bare
  `npm test`, which dispatches to Bun's built-in test runner (0 test files,
  exit 1) wherever `npm` is aliased to `bun`. `check-schemas-readme.js` now
  enforces the unambiguous form.
- Merged the duplicated `## Validation` sections in `schemas/README.md`.

### Fixed
- `check-domains.sh` passed a vacuous scan whenever stdin was not a TTY. The
  ripgrep branch was invoked without a path argument, so any non-interactive
  caller (CI, `npm run check:domains` in a pipeline) made ripgrep read empty
  stdin instead of the working tree and always report a pass.

## [0.3.0] - 2026-07-18

### Added
- Core-DP `0.1.0-lab` applicability profile with normative v0.2.0 requirement manifest, profile requirement index, JSON Schemas, conformance vectors, EPCIS/CBV fixture metadata, and profile index documentation.
- Validation coverage for Core-DP schemas, requirement links, normative `SPECIFICATION.md` RFC 2119 clause mapping, conformance vectors, semantic vector checks, and EPCIS fixture guardrails.
- `npm run check:domains` script wrapper for the repository domain policy check.
- Portable Core-DP schema conditionals for envelope body binding, choreography authority/state matrices, cross-node search auth/consistency, replay-window checks, and OpenAPI multi-header node-signature auth.
- Executable Core-DP conformance harness (`profiles/core-dp/conformance/run-conformance.js`,
  `npm run conformance:core-dp`) validating all conformance vectors against schemas and
  their declared semantic checks, cross-referenced against requirement IDs.
- `core-dp-requirements.json` enriched with rationale, owner, testability statement,
  and evidence output per requirement.

### Changed
- OpenAPI now keeps the base v0.2.0 endpoints and adds the lab-only Core-DP Product search endpoint with direct refs to the profile search request/response definitions.

### Fixed
- `docs/governance/rfc-process.md` now points to `GOVERNANCE.md` §2 as the
  authoritative RFC process for states/timing, resolving a conflict between
  the two documents.
- Corrected a stale `localloop.github.io` domain reference in the
  `spec-implementation-divergence.md` audit doc.

## [0.2.3] - 2026-05-26

### Added
- City decision-maker content in documentation: "For city decision-makers" FAQ section (cost, GDPR, governance, EU mandates), "City Operations Terms" glossary section, "Executive Summary for City Decision-Makers" in implementation guide, City Action Timeline table in regulatory alignment roadmap

### Fixed
- `package-lock.json` re-synced to resolve `ajv@8.20.0` (was locked at `8.18.0`, causing `npm ci` failures in CI)

## [0.2.2] - 2026-05-26

### Fixed
- MaterialDNA `id` pattern in `material-dna.schema.json` updated to require the `MAT-` prefix (`^MAT-[A-Z]{2}-[A-Z]{3}-\d{4}-[A-Z]+-[A-Z0-9]{6,}$`), consistent with the spec and symmetric with ProductDNA's `PRD-` prefix
- Same `MAT-` prefix pattern applied to all schemas that reference MaterialDNA IDs: `offer`, `match`, `transfer`, `material-status`, `transaction`, `loopcoin`, `product-dna`
- All 15 example payloads updated: `schema_version` bumped to `"0.2.0"`, `@context` updated to `loop-v0.2.0.jsonld`, and all MaterialDNA `id`/reference fields prefixed with `MAT-`

### Changed
- `SPECIFICATION.md` §3.6 added: entity status-transition reference table for `Offer`, `Match`, `Transfer`, `MaterialStatusUpdate`, and `Transaction`

## [0.2.1] - 2026-05-26

### Added
- ProductDNA schema (DPP-aligned product-level entity with category, condition, manufacturer, lifecycle stage, and MaterialDNA references)
- §2.1 canonical key concept definitions in specification (LOOP, MaterialDNA, ProductDNA, LoopCoin, LoopSignal, LoopCost)
- Mermaid architecture diagram in specification with MAT- prefix notation for MaterialDNA identifiers
- Regulatory compatibility roadmap (ESPR, UNTP, Germany NKWS)
- Glossary expansion with canonical term definitions

### Changed
- Specification TOC expanded with sub-items for §3.5 and §4.5
- §13.1 reframed to surface ProductDNA alongside MaterialDNA in Abstract and Core Components
- Protocol contract documentation aligned to v0.2.0 interop requirements

### Maintenance
- Upgraded Contributor Covenant to v3.0
- Replaced personal contact with org identity (dev@mycel-ai.de)
- Updated ajv to 8.20.0

## [0.2.0] - 2026-03-08

### Added
- Comprehensive DPP extension fields in MaterialDNA passport block (GTIN, economic operator, carbon footprint, recycled content, repair score, substances of concern, hazardous flag, verified ratio)
- Classification extensions (PRODCOM, TARIC, NACE, SCIP, Waste Framework codes)
- Traceability extensions (EPCIS event references, chain of custody URL, W3C VC credential ID/issuer)
- Conformity claims top-level array (UNTP-aligned: claim ID, standards, regulations, topics, declared values, evidence)
- Transfer schema extensions (traceability, passport subset, waste shipment doc ref, environmental conditions)
- JSON-LD context v0.2.0 with all 16+ type mappings and 30+ DPP term mappings
- RFC-0003: Schema Versioning Policy
- DPP extension example (12-material-dna-dpp-extensions.json)
- Conformity claims example (13-conformity-claims.json)
- LICENSES/ directory with MIT.txt and CC-BY-SA-4.0.txt
- ESPR (EU) 2024/1781, UNTP DPP, and Germany NKWS references

### Changed
- Unified all 10 schemas under v0.2.0 (eliminated v0.1.1/v1 split)
- Widened schema_version pattern to accept `0.x.y` (both 0.1.1 and 0.2.0)
- Changed @context from const to enum (accepts both v0.1.1 and v0.2.0)
- Changed additionalProperties from false to true on v1-origin schemas
- Added optional schema_version to LoopCoin, LoopSignal, Transaction, NodeInfo schemas
- Clarified dual batch fields (metadata.batch_number vs traceability.batch_id)
- Updated specification header to v0.2.0 with DPP-Compatible Lab Baseline status
- License clarified as dual: MIT for code, CC BY-SA 4.0 for specification prose
- Renumbered examples: 09-material-status → 10, 10-handshake-response → 11
- Backend API paths aligned to /api/v1/ to match specification

### Fixed
- Green Claims Directive hallucination: corrected to withdrawn June 2025
- Stale BMUV URL: updated to bundesumweltministerium.de (ministry renamed to BMUKN)
- Removed stale future release dates (0.2.0 "Q3 2025", 0.3.0 "Q4 2025", 1.0.0 "Q1 2026")
- Removed invalid JSON comments in specification Section 12 examples
- Updated specification date from December 2025 to March 2026

## [0.1.1] - 2025-12-20

### Added
- Minimal interop flow definition (MaterialDNA → Offer → Match → Transfer) for lab demos
- JSON schemas for Offer, Match, and Transfer (v0.1.1)
- v0.1.1 examples for lab demo payloads
- MaterialDNA schema versioning field for interop validation

### Changed
- MaterialDNA example payloads updated for schema version 0.1.1
- Documentation updates to clarify lab-only scope and demo status

### Security
- Added STRIDE-lite and GDPR data-minimization notes in the security guide

## [0.1.0] - 2025-05-27

### Added
- Initial LOOP specification v0.1
- Core protocol definition with four main components:
  - MaterialDNA universal identification system
  - LoopCoin expiring local currency specification
  - LoopSignal democratic preference mechanism
  - LoopCost calculation methodology
- RESTful API endpoint specifications
- Federation protocol for node-to-node communication
- JSON-LD context definitions
- Security requirements and considerations
- Implementation guidance for node operators
- Comprehensive examples of material flows
- Standard material category taxonomy
- Node discovery and authentication mechanisms

### Changed
- N/A (initial release)

### Deprecated
- N/A (initial release)

### Removed
- N/A (initial release)

### Fixed
- N/A (initial release)

### Security
- Established TLS 1.3 as minimum requirement
- Defined authentication mechanisms for users and nodes
- Set rate limiting recommendations
- Created security audit trail requirements

## [0.0.9-draft] - 2025-05-15

### Added
- Draft specification for community review
- Basic MaterialDNA format proposal
- Initial LoopCoin concept
- Preliminary API endpoint design

### Notes
- Internal draft - not publicly released
- Used for initial stakeholder feedback

## [0.0.1-concept] - 2025-04-01

### Added
- Original concept document
- Problem statement
- High-level architecture vision

### Notes
- Conceptual phase - no implementation details
- Inspired by ActivityPub and Carlsson & Nevzorova (2025)

---

## Version History Summary

| Version | Date | Status | Key Changes |
|---------|------|---------|------------|
| 0.3.0 | 2026-07-18 | **Current** | Core-DP 0.1.0-lab applicability profile, conformance harness |
| 0.2.3 | 2026-05-26 | Superseded | City decision-maker docs, package-lock fix |
| 0.2.2 | 2026-05-26 | Superseded | MAT- prefix fix, example v0.2.0 updates, §3.6 status transitions |
| 0.2.1 | 2026-05-26 | Superseded | ProductDNA schema, spec expansion, glossary |
| 0.2.0 | 2026-03-08 | Superseded | DPP extensions, schema consolidation, context completion |
| 0.1.1 | 2025-12-20 | Superseded | Minimal interop lab demo baseline |
| 0.1.0 | 2025-05-27 | Superseded | Initial public release |
| 0.0.9-draft | 2025-05-15 | Superseded | Internal draft |
| 0.0.1-concept | 2025-04-01 | Archived | Concept document |

## Upgrade Guide

### From concept to 0.1.0
This is the first implementable version. Key changes:
1. Formal API specifications added
2. Security requirements defined
3. Federation protocol established
4. MaterialDNA format finalized

## Future Direction

Future releases may include:
- Smart contract integration (see RFC-0004)
- IoT and sensor integration
- Profile-based extension guidance for product-specific DPP delegated acts
- Conformance test suites for additive patch releases
- Advanced routing and batch operations

---

## Maintenance

This changelog is maintained by the LOOP core team. 

**How to contribute:**
1. Fork the repository
2. Add your changes under `[Unreleased]`
3. Follow the Keep a Changelog format
4. Submit a pull request

**Changelog update checklist:**
- [ ] Version number follows semver
- [ ] Date is accurate
- [ ] Changes categorized correctly
- [ ] Security implications noted
- [ ] Upgrade guide updated if needed
- [ ] Links updated at bottom

---

[Unreleased]: https://github.com/local-loop-io/loop-protocol/compare/v0.2.3...HEAD
[0.2.3]: https://github.com/local-loop-io/loop-protocol/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/local-loop-io/loop-protocol/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/local-loop-io/loop-protocol/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/local-loop-io/loop-protocol/compare/v0.1.1-demo...v0.2.0
[0.1.1]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.1.1
[0.1.0]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.1.0
[0.0.9-draft]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.0.9-draft
[0.0.1-concept]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.0.1-concept
