# Changelog

All notable changes to the LOOP specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
| 0.2.0 | 2026-03-08 | **Current** | DPP extensions, schema consolidation, context completion |
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

[Unreleased]: https://github.com/local-loop-io/loop-protocol/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/local-loop-io/loop-protocol/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.1.1
[0.1.0]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.1.0
[0.0.9-draft]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.0.9-draft
[0.0.1-concept]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.0.1-concept
