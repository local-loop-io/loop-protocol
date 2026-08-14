# Governance Charter

This lightweight charter is for a 3-5 person project. It governs project-wide decisions, RFCs, releases, and claims. Technical work remains owned by the relevant area maintainer.

## 1. Maintainers and Ownership

| Role | Initial roster | Primary ownership | Decision backup |
| --- | --- | --- | --- |
| Project steward and merge authority | `alpha912` | release approval, governance, external claims | protocol maintainer |
| Protocol maintainer | unassigned | specification, schemas, contexts, compatibility | project steward |
| Backend maintainer | unassigned | API, data handling, operations | project steward |
| Docs/site maintainer | unassigned | public docs, mirrors, accessibility evidence | project steward |

An **active maintainer** is a distinct natural person with a recorded role who has participated in the preceding 30 days or has a recorded leave, handoff, or availability date. An **eligible maintainer** is an active maintainer whose nomination and acceptance are recorded; they may participate unless recused. A record names the person, role and owned area, date, nominator, and the person's acceptance, in this table or a linked RFC/release record. Handles may be used, but must identify the natural person in the private project record.

The steward records a named person before assigning work or approving a release in an unassigned area. A new or changed maintainer appointment requires a recorded nomination, the nominee's recorded acceptance, and approval by two distinct eligible non-recused natural persons; the nominee cannot appoint themself unilaterally. Bootstrap exception: before two eligible maintainers exist, the initial steward may nominate exactly one second natural person, who must explicitly accept in the record. This bootstrap appointment creates no approval by itself, cannot be used if another eligible maintainer already exists, and releases and high-risk claims remain blocked until that second person is appointed and independently approves under normal quorum. Afterward, every appointment uses the two-person rule. One person may hold multiple roles, but a reviewer must not approve their own high-risk claim alone. Maintainer changes are recorded in this table and announced in the relevant RFC or release note.

## 2. RFC and Decision Process

Use an RFC for protocol changes, compatibility changes, security/privacy posture, public claims, governance changes, or work that affects more than one owned area. An RFC states the problem, scope, alternatives, decision, owner, compatibility impact, evidence plan, and target decision date.

States are `Draft`, `Review`, `Accepted`, `Rejected`, `Superseded`, and `Withdrawn`. Review is at least 5 calendar days, or 48 hours for a documented urgent security/privacy response. The proposer may close a routine area decision after the review window if no maintainer objects.

For every quorum decision, **quorum is exactly two distinct eligible, non-recused natural persons**. The steward is not a required quorum member. Cross-area, compatibility, release, governance, and high-risk claim decisions require that quorum and an explicit recorded approval from every affected-area owner; an owner may supply one of the two quorum approvals. Other comments or acknowledgements do not expand the quorum. A tie or unresolved objection defers the decision; it is not silently approved.

## 3. Appeals, Conflicts, and Continuity

Any contributor may appeal an Accepted or Rejected RFC within 7 days with new evidence or a concrete process concern. The non-recused maintainers reconsider within 7 days and record the result. A maintainer must recuse from approval when they have a material personal, financial, employer, vendor, or authorship conflict that could reasonably affect impartiality. A recused steward has no approval, merge, or appointment authority for that matter; the listed decision backup acts only for that matter if eligible and non-recused. If that backup is unavailable, two eligible non-recused maintainers record an ad hoc facilitator. Recusal never reduces the two-person quorum or affected-owner requirement.

If a maintainer is inactive for 30 days without a handoff, two eligible non-recused maintainers may appoint an interim owner using the recorded nomination and acceptance process. If the steward is inactive or permanently leaves, two eligible non-recused maintainers may appoint an interim steward and record the appointment and acceptance; this authority comes from this charter, not from the absent steward. A steward may also arrange a planned successor through the normal two-person appointment process before leaving. An abandoned area remains frozen for releases and outward claims until an interim owner accepts it, inventories open work and evidence, and records a handoff note.

No approval, release, or high-risk claim may proceed when two eligible non-recused people are unavailable, or when an affected-area owner is unavailable. The scope must instead be deferred, narrowed to an unaffected area, or recorded as blocked; no interim appointment can be self-authorized to bypass this rule.

## 4. Release and Claim Gates

Every release follows [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md). Every outward statement follows [CLAIMS-AND-MATURITY.md](CLAIMS-AND-MATURITY.md). These gates do not establish that a feature ships; they establish the decision record required before saying it does.

Every outward claim requires review by a distinct eligible, non-recused maintainer who is neither its author nor its owner. If no such reviewer is available, publication is blocked. High-risk claims additionally require the two-person governance approval in Section 2; the independent claim reviewer may count only if otherwise eligible for that approval.

**Solo-operator note:** while the project has fewer than two active, eligible, non-recused maintainers, the quorum and independent-reviewer requirements above are narrowly superseded by [RFC-0005](../../rfcs/0005-solo-operator-governance-override.md) and [pilot-readiness/SOLO-OPERATOR-ADDENDUM.md](pilot-readiness/SOLO-OPERATOR-ADDENDUM.md) — self-review with mandatory linked evidence, a recorded rationale, and a mandatory public disclosure, not a silent bypass. It sunsets automatically once a second maintainer is appointed under Section 1.
