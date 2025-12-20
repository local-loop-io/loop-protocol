# Threat Model (Lab Baseline)

This threat model is a **lab-only baseline** for the LOOP protocol. It is not a
production security assessment.

## System boundaries
- **LOOP Node API** (lab demo): handles MaterialDNA, Offer, Match, Transfer.
- **Event log**: immutable audit trail for lab events.
- **Public interest registry**: optional contact data.

## Assets
- Protocol payloads (MaterialDNA, Offer, Match, Transfer)
- Event logs and timestamps
- Optional contact data (interest submissions)

## Threats (STRIDE-lite)

| Threat | Example | Mitigation (lab) |
| --- | --- | --- |
| Spoofing | Fake node identity | Mutual TLS / signed requests (future), allowlist in lab |
| Tampering | Offer payload modified | Schema validation, server-side logging |
| Repudiation | Deny match acceptance | Immutable event log with timestamps |
| Information disclosure | PII leaks | Data minimization, redact logs |
| Denial of service | Flood endpoints | Rate limits, request size limits |
| Elevation of privilege | Abuse admin endpoints | Auth scaffolding (future), least privilege |

## Residual risk (lab stage)
Risks remain due to the early TRL level and the absence of production-grade
identity, key management, and audit tooling. This document should be revisited
before any pilot deployments.
