# RFC Process (v0.1)

This RFC process is a lightweight governance workflow for the LOOP protocol
while the project remains in **lab-only, low-TRL** stage. It is intended to
create clear, reviewable decisions without implying production readiness.

## Goals
- Make protocol changes transparent and traceable.
- Capture rationale, alternatives, and security/privacy impacts.
- Keep the process lightweight for early-stage iteration.

## Scope
Applies to:
- Protocol schema changes
- API surface changes
- Node interoperability rules
- Governance and security requirements

## RFC states
1. **Draft** – Authoring and internal review.
2. **Discussion** – Open for comments (target: 10 business days).
3. **Accepted / Rejected** – Decision documented with rationale.
4. **Implemented** – Linked to merged PRs and release notes.
5. **Superseded** – Replaced by a newer RFC.

## How to submit
1. Copy `rfcs/template.md` → `rfcs/NNNN-title.md`.
2. Fill in all required sections.
3. Open a PR with the RFC for review.
4. The PI or designated reviewer approves or rejects the RFC.

## Decision rules (lab stage)
- Favor reversible changes.
- Require explicit notes on security/privacy impact.
- Document any breaking changes and migration steps.

## Record keeping
Accepted RFCs are indexed in `rfcs/README.md` and referenced from the changelog.
