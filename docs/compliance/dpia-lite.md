# DPIA Lite (Lab Baseline)

This DPIA-lite is a **lab-only baseline** for early-stage evaluation. It does
not imply production readiness or pilot deployment.

## Data categories
- **Protocol payloads**: MaterialDNA, Offer, Match, Transfer (non-PII).
- **Interest submissions**: optional contact data (name, email, organization).

## Purpose
Enable lab validation of protocol flows and collect early interest from
potential collaborators.

## Legal basis (lab stage)
Consent for optional contact data; legitimate interest for aggregate analytics.

## Data minimization
- Avoid personal data in protocol payloads.
- Collect only optional contact data required for follow-up.
- Support opt-in for public listing.

## Retention
Retain lab data only as long as needed for validation; delete on request.

## Security measures
- TLS for transport.
- Request size limits and rate limiting.
- Audit logging of submissions and events.

## Risks and mitigations
- **Risk**: accidental exposure of contact data.  
  **Mitigation**: optional email visibility and redaction.
- **Risk**: over-collection.  
  **Mitigation**: strict schema and minimization policy.

## Review cadence
Reassess before any pilot or production deployment.
