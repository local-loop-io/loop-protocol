# Solo-Operator Addendum to GOVERNANCE.md

**Enacted by:** [RFC-0005](../../../rfcs/0005-solo-operator-governance-override.md).
**Status:** In effect. **Owner:** `alpha912`.
**Applies while:** the project has fewer than two active, eligible,
non-recused maintainers under [GOVERNANCE.md](../GOVERNANCE.md) §1.
**Last reviewed:** 2026-08-14.

## What this overrides, precisely

This addendum supersedes exactly three quorum mechanics, and nothing else:

1. GOVERNANCE.md §2's requirement that release, cross-area, and high-risk
   claim decisions have "quorum... exactly two distinct eligible, non-recused
   natural persons."
2. GOVERNANCE.md §4's requirement that high-risk claims "additionally
   require the two-person governance approval in Section 2."
3. CLAIMS-AND-MATURITY.md §3's requirement that "before publication, every
   outward claim must be reviewed by a distinct eligible, non-recused
   maintainer who is neither its author nor its owner" (and the high-risk
   variant of the same rule).

Everything else in both documents remains in full force, unmodified,
including: the evidence-backed status vocabulary and claim rules in
CLAIMS-AND-MATURITY.md §1-2 and §4; GOVERNANCE.md §1's maintainer-appointment
process (a second maintainer is appointed exactly as §1 describes — this
addendum creates no shortcut for that); and GOVERNANCE.md §3's recusal and
continuity rules.

## What replaces the missing second reviewer

Every release or outward claim published under this addendum must satisfy
**all** of the following before publication, recorded in writing alongside
the claim (not just performed silently in the author's head):

### Self-review checklist

- [ ] **Scope check.** The claim's wording matches exactly what the linked
      evidence supports — no broader implication than the evidence carries
      (per CLAIMS-AND-MATURITY.md §1's artifact-maturity vs.
      evidence-backed-implementation-status distinction).
- [ ] **Evidence check.** Every factual assertion in the claim links to a
      reviewable artifact meeting CLAIMS-AND-MATURITY.md §2's bar
      (immutable revision reference, reproducible test result, dated demo
      record, or equivalent) — not a plan, a schema, a policy document, or
      an unverified assertion.
- [ ] **Disconfirmation check.** Before publishing, actively look for the
      strongest evidence *against* the claim (a failing test, an
      undocumented boundary, a stale figure) rather than only evidence for
      it. Record what was checked, even if nothing adverse was found.
- [ ] **Metadata check.** Claim owner, evidence link(s), reviewer note, review
      date, and expiry (default 90 days per CLAIMS-AND-MATURITY.md §3, or
      shorter if risk/dependency volatility warrants) are all recorded.
- [ ] **Cooling-off check.** At least a few hours (ideally 24) elapse between
      drafting the claim and publishing it, and it is re-read fresh before
      publication. This is not a substitute for independent review, but it
      is a real, cheap way to catch what a same-session author-reviewer
      cannot see in themselves.
- [ ] **Policy cross-check.** Claim text is checked against the workspace
      Claims Policy (`CLAUDE.md`: "No public pilots or deployments... lab
      demo only") and `DOMAIN-POLICY.md` before publishing.
- [ ] **Disclosure present.** The claim carries the exact disclosure text
      below, not a paraphrase.

### Mandatory disclosure text

Every claim published under this addendum must include, verbatim or with
only cosmetic formatting changes:

> This claim was reviewed under the Solo-Operator Addendum
> ([RFC-0005](../../../rfcs/0005-solo-operator-governance-override.md)):
> the project currently has one active maintainer, so no independent
> two-person governance review (as GOVERNANCE.md normally requires) has
> occurred. The evidence linked below is real and current as of the review
> date; the review itself is self-review only.

### Recorded rationale

This addendum exists because GOVERNANCE.md's two-person quorum, as written
for a 3-5 person project, has no path for a genuinely solo maintainer — see
[RFC-0005](../../../rfcs/0005-solo-operator-governance-override.md)'s
Motivation section for the full reasoning. The short version: the charter's
own bootstrap exception keeps releases and high-risk claims blocked until a
second person independently approves, which cannot happen with zero other
maintainers on any timeline the solo maintainer controls. The alternative
to this addendum was not "normal governance" — it was either silently
treating self-review as if it were independent review (misleading), or an
indefinite freeze on ever discussing pilot readiness regardless of how much
real evidence exists (see RFC-0005, Alternatives Considered).

## Sunset

This addendum stops applying to newly published claims automatically, the
moment a second active, eligible, non-recused maintainer is appointed under
GOVERNANCE.md §1's normal appointment process (recorded nomination + that
person's recorded acceptance). No separate vote or edit to this file is
needed to end it — normal GOVERNANCE.md quorum simply resumes governing new
decisions from that point. Claims already published under this addendum keep
their original disclosure; history is not rewritten.

## Applying this addendum

Used by [PILOT-READINESS-CLAIM.md](PILOT-READINESS-CLAIM.md), the first
claim published under it. Any future claim made while the project remains
solo-maintained should follow the same checklist and carry the same
disclosure.
