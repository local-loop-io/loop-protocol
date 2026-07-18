# Claims and Maturity Policy

This policy is the project-wide vocabulary for artifacts, implementation evidence, and outward statements. It applies to specifications, schemas, code, demos, sites, release notes, presentations, and conversations on behalf of the project.

## 1. Use Two Separate Labels

Do not use one label to mean both document quality and working-system proof.

| Label type | Allowed values | Meaning |
| --- | --- | --- |
| Artifact maturity | Draft, Review, Candidate, Published, Superseded | The review and publication state of a document, schema, example, or release artifact. It says nothing about implementation. |
| Evidence-backed implementation status | Proposed, Implemented, Tested, Demonstrated, Operationally evidenced | The strongest status supported by linked evidence for the stated scope. |

`Preview` may describe limited visibility or an early user experience only. It does not mean production-ready, deployed, secure, compliant, conformant, accessible, or operationally proven. A preview must state its scope and the status labels above.

`vNext/Core-DP direction` is a planning term for the intended next core data-plane direction. It is neither a version commitment nor evidence that any part ships, is implemented, or is on a release path.

## 2. Evidence-Backed Status

- **Proposed:** documented intent; no implementation claim.
- **Implemented:** a specific change exists at an identified revision; link the change.
- **Tested:** implemented scope has repeatable passing checks; link results and date.
- **Demonstrated:** the stated scenario was run in a controlled environment; link the scenario, result, date, and limits.
- **Operationally evidenced:** bounded real operation has current monitoring or drill evidence; link scope, period, environment, and limitations. This is not a synonym for production readiness.

Status applies only to the named artifact, feature, environment, and time period. A status never transfers automatically to another repo, mirror, environment, version, or release.

## 3. Claim Rules

Unsupported claims are prohibited. Do not claim or imply pilots, deployments, production use/readiness, compliance, certification, regulatory alignment/readiness, provenance/traceability, security, accessibility, or conformance unless the claim has current, scoped evidence.

Acceptable evidence is reviewable and linked: immutable revision or release references; reproducible test or conformance results; dated demo records; independent assessment reports; approved security reviews; accessibility test results; deployment/change records; and backup plus successful restore-drill records. Evidence must identify its environment, date, owner, method, result, and limits. A policy, plan, schema, badge, or unverified assertion is not evidence of implementation or outcome.

Each outward claim needs a claim owner, evidence link, reviewer, review date, and expiry. Default expiry is 90 days; use a shorter expiry when the environment, dependency, or risk changes faster. On expiry, remove or downgrade the claim until re-evidenced. The owner must correct a known inaccurate or outdated claim promptly, including the affected release notes, site copy, and announcement surfaces.

Before publication, every outward claim must be reviewed by a distinct eligible, non-recused maintainer who is neither its author nor its owner. If no such reviewer is available, publication is blocked. High-risk claims (security, privacy, accessibility, conformance, compliance, certification, regulatory, pilot, deployment, or production) additionally require the two-person governance approval in [GOVERNANCE.md](GOVERNANCE.md). When evidence is absent, use qualified language such as "proposed," "lab demo only," or "not independently assessed."

## 4. Current-Use Boundary

Historical audits are not evidence of current implementation. Read their snapshot warning, then use this policy and [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md) for a current claim or release decision.
