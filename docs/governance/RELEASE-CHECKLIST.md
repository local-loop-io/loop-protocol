# Unified Release Checklist

Use this checklist for any public artifact, protocol, backend, site, or coordinated release. Every item needs an evidence link. Mark `N/A` only with a short rationale and the approving maintainer. The release owner keeps the completed checklist with the release record.

| Gate | Evidence required | Status / link / N/A rationale |
| --- | --- | --- |
| Scope and owner | release scope, owner, approvers, target date | |
| Version consistency | version/tag is consistent across changed artifacts, metadata, and release notes | |
| Canonical artifacts and mirrors | canonical source identified; required docs/schema/OpenAPI/context mirrors compared or updated | |
| Documentation integrity | dated Markdown validation result; local-link and external-link results; canonical-domain/policy check result; and any documented exceptions | |
| Changelog and release notes | user-facing changes, limitations, upgrade notes, and corrections recorded | |
| Compatibility and migrations | compatibility decision, migration/rollback path, and affected versions | |
| Security and privacy | scoped review, secret handling, data/PII impact, and unresolved-risk decision | |
| Accessibility | applicable accessibility checks, known limits, and remediation owner | |
| Conformance and tests | applicable conformance, schema, unit/integration, and manual test results | |
| Backup and restore drill | dated backup evidence and successful restore-drill evidence, or N/A rationale | |
| Outward claims | review against [CLAIMS-AND-MATURITY.md](CLAIMS-AND-MATURITY.md); owner, evidence, scope, expiry, review date, and a distinct eligible reviewer who is neither author nor owner | |
| Approval | approvals required by [GOVERNANCE.md](GOVERNANCE.md), conflicts/recusals recorded | |

Do not substitute a checklist tick for evidence. A failed, missing, stale, or out-of-scope item blocks the associated claim or release scope. Risk acceptance may only narrow the release scope; it can never waive outward-claim evidence, required approvals, or legal, security, or privacy blockers. Use the [backup and restore runbook](../backup-restore-runbook.md) as a procedure reference; the checklist still requires dated drill evidence.
