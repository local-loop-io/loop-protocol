# Changelog

All notable changes to the LOOP Protocol specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Smart contract integration planning in RFC-004
- Multi-material bundle specification draft
- WebSocket support for real-time updates
- Schema validation script and CI workflow
- Example JSON payloads for schemas
- RFC template and RFC 0004 draft
- Documentation: glossary, FAQ, implementation guide, security guides

### Changed
- Clarified LoopSignal voting weight calculations
- Updated project structure documentation
- Adjusted README to remove unverified deployment claims
- Updated maintainer contact details
- Updated roadmap to remove unverified test network/pilot claims

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Typo in MaterialDNA regex pattern example
- Repaired truncated MaterialDNA schema JSON
- Corrected LoopCost reference implementation variables
- Aligned specification examples with schema-required fields and types

### Security
- Nothing yet

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
- Initial LOOP Protocol specification v0.1
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
| 0.1.1 | 2025-12-20 | **Current** | Minimal interop lab demo baseline |
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

## Future Releases

### [0.2.0] - Planned Q3 2025
Expected additions:
- Smart contract templates
- Advanced routing algorithms
- Mobile SDK specifications
- Reputation system

### [0.3.0] - Planned Q4 2025
Expected additions:
- IoT integration standards
- Carbon credit calculations
- Multi-language support
- Batch operations

### [1.0.0] - Planned Q1 2026
- Stable API guarantee
- Production-ready specification
- Full test suite
- Compliance certification program

---

## Maintenance

This changelog is maintained by the LOOP Protocol core team. 

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

[Unreleased]: https://github.com/local-loop-io/loop-protocol/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.1.1
[0.1.0]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.1.0
[0.0.9-draft]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.0.9-draft
[0.0.1-concept]: https://github.com/local-loop-io/loop-protocol/releases/tag/v0.0.1-concept
