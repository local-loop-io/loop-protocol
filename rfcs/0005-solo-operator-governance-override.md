# RFC-0005: Solo-Operator Governance Override for Releases and High-Risk Claims

**Status:** Self-enacted under documented necessity — **not** `Accepted`. No
quorum was available to accept this RFC through the normal process; see
Motivation. See [SOLO-OPERATOR-ADDENDUM.md](SOLO-OPERATOR-ADDENDUM.md) for the
operative policy this RFC adopts.
**Owner:** `alpha912` (project steward, sole active maintainer).
**Date:** 2026-08-14.

## Summary

[GOVERNANCE.md](GOVERNANCE.md) requires **exactly two distinct eligible,
non-recused natural persons** for release, cross-area, and high-risk-claim
decisions (§2), and its own bootstrap exception (§1) explicitly keeps
releases and high-risk claims **blocked** until a second person is appointed
and independently approves under normal quorum. Today the project has
exactly one active, eligible maintainer. This RFC documents that impasse and
adopts [SOLO-OPERATOR-ADDENDUM.md](SOLO-OPERATOR-ADDENDUM.md) — a narrow,
transparent, evidence-preserving substitute for the quorum requirement,
scoped only to releases and high-risk claims, until a second real maintainer
is appointed.

## Motivation

GOVERNANCE.md's own preamble states it "is for a 3-5 person project." §1's
maintainer table names one active person (`alpha912`, project steward); the
protocol, backend, and docs/site maintainer roles are recorded as
`unassigned`. §1's bootstrap exception allows the steward to nominate exactly
one second natural person — but is explicit that "this bootstrap appointment
creates no approval by itself... and releases and high-risk claims remain
blocked until that second person is appointed and independently approves
under normal quorum." Read literally and honestly, the charter provides
**no path** for a genuinely solo operator to ever approve a release or a
high-risk claim — only a path to *bridge* a temporary staffing gap in an
otherwise 3-5 person team. That is a correct and valuable safeguard for the
team the charter was written for. It is not a safeguard this project can
currently satisfy, because there is no second person, not because a
temporary process step is pending.

Reaching city-pilot-outreach readiness requires being able to draft and
stand behind a bounded, evidenced pilot-readiness claim
(`PILOT-READINESS-CLAIM.md`). Under GOVERNANCE.md as literally written, that
claim can never be published, indefinitely, regardless of how much real
evidence backs it — the blocker is structural (no second person), not
evidentiary. This RFC does not dispute that two-person review is the better
safeguard against unchecked self-interested claims. It documents, in the
open, that it is currently unavailable, and chooses a transparent,
self-disclosed, evidence-preserving alternative over the two other options
considered (see Alternatives).

## Proposal

Adopt [SOLO-OPERATOR-ADDENDUM.md](SOLO-OPERATOR-ADDENDUM.md), which:

1. Narrowly supersedes GOVERNANCE.md §2's two-person quorum requirement and
   §4's high-risk-claim quorum requirement, and CLAIMS-AND-MATURITY.md §3's
   independent-reviewer requirement — **only** for releases and outward
   claims, **only** while the project has fewer than two active, eligible,
   non-recused maintainers.
2. Does **not** touch GOVERNANCE.md §1 (maintainer appointment — a second
   maintainer must still be appointed exactly as §1 describes; this RFC
   creates no shortcut for that) or §3 (continuity/recusal rules), which
   remain in full force.
3. Replaces the missing second reviewer with: a mandatory written
   self-review checklist, an unchanged (not lowered) evidence bar per
   CLAIMS-AND-MATURITY.md §2-3, a recorded rationale per claim, and a
   mandatory visible disclosure on every claim published under it, so no
   reader mistakes solo review for the two-person review GOVERNANCE.md
   normally requires.
4. Sunsets automatically, per-claim going forward (not retroactively), the
   moment a second active, eligible, non-recused maintainer is appointed
   under §1's normal process.

## Security & Privacy

The risk two-person review primarily guards against is an unchecked,
self-interested, or overstated outward claim. This RFC's mitigations:

- **Evidence bar is unchanged.** This RFC removes the second-reviewer
  requirement; it does not relax CLAIMS-AND-MATURITY.md §2-3's requirement
  that every claim carry current, scoped, linked evidence. A solo-reviewed
  claim with fabricated or absent evidence is exactly as prohibited as it
  was before this RFC.
- **Mandatory disclosure prevents misrepresentation.** Every claim made
  under the addendum visibly states that it was solo-reviewed and that no
  independent quorum review occurred — the specific harm of *silently*
  bypassing governance (misleading a reader, including a prospective city
  partner, into trusting a review that didn't happen) is directly addressed.
- **Narrow scope limits blast radius.** The override applies only to the
  quorum mechanic for releases/high-risk claims, not to any other part of
  governance, and not to the evidence, retention, or security posture of the
  system itself.
- **Self-terminating.** The override cannot be used as a permanent
  workaround — the moment a second real maintainer exists, it stops applying
  to new claims by construction (§1's normal quorum resumes).

## Backwards Compatibility

Non-breaking. GOVERNANCE.md's text is not edited beyond a short pointer to
this RFC and the addendum (added in §4, so a reader of the main charter can
discover the override exists — this RFC does not rely on a reader finding an
orphaned document). All other governance provisions are unchanged.

## Implementation Plan

Documentation/process only:
1. This RFC (`rfcs/0005-solo-operator-governance-override.md`).
2. `docs/governance/pilot-readiness/SOLO-OPERATOR-ADDENDUM.md` (operative
   policy and checklist).
3. A short pointer added to `GOVERNANCE.md` §4.
4. `rfcs/README.md` index entry.
5. Applied immediately to `PILOT-READINESS-CLAIM.md` (the first claim
   published under this addendum).

## Alternatives Considered

1. **Recruit a second real maintainer first, then proceed normally.** This
   is the actual correct long-term fix and remains the goal — see the
   addendum's sunset clause. Rejected as the *only* path forward because it
   is not on any timeline the solo maintainer controls, and the directive
   this RFC responds to explicitly calls for a documented interim process
   rather than an indefinite wait.
2. **Silently treat self-review as satisfying GOVERNANCE.md's quorum.**
   Rejected outright — this misrepresents to every future reader (including
   a prospective city partner reading a pilot-readiness claim) that
   independent review occurred when it did not. This is the one option the
   directive this RFC responds to explicitly ruled out.
3. **Freeze all releases and outward claims until a second maintainer
   joins.** Rejected: this leaves the project structurally unable to ever
   discuss pilot readiness, no matter how much real, linked evidence exists.
   CLAIMS-AND-MATURITY.md's evidence discipline (scoped, dated, linked,
   expiring claims) is itself a strong safeguard against overclaiming, largely
   independent of who reviews it; combined with mandatory disclosure of the
   solo-review limitation, a rigorously evidenced, self-disclosed claim is
   more transparent and more useful to a reader than the alternative of
   saying nothing at all.

## Open Questions

- **When does this addendum stop applying?** Answered by the addendum's
  sunset clause: automatically, for claims published after a second active,
  eligible, non-recused maintainer is appointed under GOVERNANCE.md §1's
  normal process. Claims already published under this addendum keep their
  original disclosure (history is not rewritten).
- **Does this RFC itself need two-person approval to take effect?** No —
  by construction it cannot get it (that is the impasse it documents). It
  takes effect on publication by the sole eligible maintainer, which is
  exactly why its status is marked "Self-enacted under documented necessity"
  rather than "Accepted."
