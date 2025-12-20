# RFC-0001: RFC Process (v0.1)

## Summary
Establish a lightweight RFC workflow for the LOOP protocol during lab-only
development to document decisions and ensure traceability.

## Motivation
We need a consistent process for evolving schemas and interoperability rules
without implying production readiness. A minimal RFC flow provides clarity for
reviewers (including EC stakeholders) while keeping iteration lightweight.

## Proposal
Adopt the process defined in `docs/governance/rfc-process.md` with the states:
Draft → Discussion → Accepted/Rejected → Implemented → Superseded.

## Security & Privacy
Each RFC must include security and privacy impact notes. No PII should be added
to protocol payloads.

## Backwards Compatibility
RFCs must explicitly state if changes are breaking and include migration notes.

## Implementation Plan
1. Add RFC docs and templates.
2. Require RFC links for schema/API changes.
3. Track accepted RFCs in the changelog.

## Alternatives Considered
- No formal process (rejected: lacks traceability).
- Heavy governance workflow (rejected: too slow for lab stage).

## Open Questions
None for v0.1.
