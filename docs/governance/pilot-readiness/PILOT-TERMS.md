# Draft Minimal Pilot Terms — Municipal Reuse-Depot Pilot

> **This is a draft starting point, not legal advice, and not ready to
> sign.** It must be reviewed by a real lawyer — ideally one familiar with
> public-sector/municipal procurement in the specific jurisdiction involved
> — before use with any actual municipality. Municipal counterparties often
> have jurisdiction-specific requirements this draft cannot resolve on its
> own: procurement rules, sovereign immunity (which can limit or void
> standard liability-limitation language against a government entity, and
> cuts both ways), public-records/freedom-of-information law (which may
> make pilot data, including this document itself, subject to disclosure
> requests regardless of what this draft says), insurance requirements, and
> data-residency or data-protection law specific to that jurisdiction. This
> draft is deliberately generic and jurisdiction-agnostic because no
> specific real municipality has been identified as of this draft
> (2026-08-14) — see
> [PILOT-USE-CASE.md](PILOT-USE-CASE.md).

**Owner:** `alpha912`. **Status:** Draft, self-reviewed under the
[Solo-Operator Addendum](SOLO-OPERATOR-ADDENDUM.md) — no independent legal
or governance review has occurred. **Last reviewed:** 2026-08-14.

## 1. Purpose and scope

This pilot covers exactly the flow locked in
[PILOT-USE-CASE.md](PILOT-USE-CASE.md): the municipal reuse-depot flow
(`ProductDNA` → `Offer` → `Match` → `Transfer`) run against a single
localLOOP lab node. It does not cover, and no party should represent it as
covering: LoopCoin/settlement, LoopSignal/governance, LoopCost/pricing,
cross-node federation, or any regulatory conformance claim (DIWASS, Battery
Passport, ESPR DPP, or otherwise) — see PILOT-USE-CASE.md's exclusions list
for the reasoning behind each.

## 2. Lab-pilot framing (not production)

This is lab-stage software, run as a pilot, not a production deployment.
Specifically, and matching the project's Claims Policy:

- No uptime service-level agreement (SLA). The node may be taken down for
  maintenance, debugging, or schema changes with reasonable notice
  (target: 48 hours where practical, not guaranteed).
- No guarantee of data durability beyond the backup practices documented in
  [backup-restore-runbook.md](../../backup-restore-runbook.md) and
  evidenced in the drill referenced from
  [PILOT-READINESS-CLAIM.md](PILOT-READINESS-CLAIM.md) — which covers the
  local development stack, not a dedicated pilot production environment.
  Before any real data enters the system, the parties should agree
  explicitly on where the pilot node actually runs and what backup
  arrangement applies there specifically.
- No claim of security certification, compliance, or accessibility
  conformance. See
  [dpia-lite.md](../../compliance/dpia-lite.md) and
  [threat-model.md](../../compliance/threat-model.md) for the current,
  honestly-scoped security/privacy posture, including known open gaps
  (no per-operator write attribution, no per-tenant data isolation, no
  automated deletion path for operator account data).
- Either party may pause or end the pilot at any time per Section 6.

## 3. Data handling

- **Ownership.** The municipality retains ownership of any data it submits
  (reuse-depot product/offer/transfer records, and any contact information
  provided by its staff). The project does not sell, license, or share
  pilot data with third parties.
- **What data actually moves.** See dpia-lite.md's four flows. In summary:
  the reuse-depot flow itself carries no personal data; the public interest
  form and (if `AUTH_ENABLED` is used) operator sign-in each carry limited
  personal data (name, optional email/organization, and — for operator
  accounts — IP address and session history). The municipality should
  decide, before real use, whether operator accounts are used for this
  pilot and who those named individuals are.
- **Retention and deletion.** Per dpia-lite.md, there is currently no
  automated deletion path for operator account data — deletion during the
  pilot is a manual, operator-performed action on request. The parties
  should agree on a specific retention period for pilot-generated records
  before real data enters the system; the project's lab defaults (e.g. the
  evidence log's 2-year default) are lab defaults, not a negotiated term.
- **Public-records / freedom-of-information exposure.** Depending on the
  municipality's jurisdiction, records generated during this pilot
  (including correspondence and this document) may be subject to public
  disclosure law regardless of what this agreement says. That is the
  municipality's own legal determination to make — the project does not
  and cannot represent otherwise.
- **No use as a compliance claim.** Neither party will represent
  participation in this pilot as evidence of the other's regulatory
  compliance, environmental performance, or sustainability claims, per
  [CLAIMS-AND-MATURITY.md](../CLAIMS-AND-MATURITY.md) and the green-claims
  governance note in
  [regulatory-alignment-roadmap.md](../../regulatory-alignment-roadmap.md).

## 4. Roles and responsibilities

**The project provides:** access to a lab node instance running the locked
pilot flow; best-effort support during the pilot window; the documentation
referenced throughout this file.

**The municipality provides:** a named technical or operational contact;
the actual reuse-depot records it wants to route through the pilot flow
(submitted via direct API integration — there is currently no non-technical
data-entry UI, see PILOT-USE-CASE.md's "what a real pilot would still
require" section); timely feedback on issues encountered.

Neither party is obligated to continue past the term in Section 6, and
nothing here commits either party to a future production relationship,
paid engagement, or procurement process.

## 5. Liability and warranties

The software and pilot service are provided **"as is"** and **"as
available,"** without warranty of any kind, express or implied, including
without limitation warranties of merchantability, fitness for a particular
purpose, non-infringement, or uninterrupted/error-free operation. To the
maximum extent permitted by applicable law, the project's total liability
arising from the pilot is limited to direct damages, and excludes indirect,
incidental, consequential, or punitive damages. **This section is a
placeholder, not vetted language** — liability limitation against a
government entity is often restricted or unenforceable as written
(sovereign immunity, statutory caps, or a requirement that the *vendor*
indemnify the municipality rather than the reverse are all common in
practice and vary by jurisdiction). Real counsel must draft or approve this
section before signature.

## 6. Term and exit criteria

- **Term.** The pilot runs for an agreed fixed window (suggest 60-90 days
  as a starting point, matching the 90-day default claim-expiry cadence in
  CLAIMS-AND-MATURITY.md) — fill in actual dates before use. It does not
  automatically renew.
- **Early termination.** Either party may end the pilot at any time with
  reasonable notice (suggest 5 business days, matching GOVERNANCE.md's
  routine-decision review window) and no penalty.
- **At termination (scheduled or early):**
  1. The project provides the municipality an export of its own
     pilot-generated data in a machine-readable format (the underlying
     JSON-LD payloads) within a reasonable period (suggest 30 days).
  2. Either party may request deletion of the municipality's data from the
     pilot node; the project confirms deletion in writing. (Per Section 3,
     this is currently a manual process — a real pilot commitment should
     have this in place and tested, not just documented, before real data
     enters the system.)
  3. Neither party is obligated to continue, extend, or convert the pilot
     into a production engagement absent a new, separately negotiated
     agreement.
- **What ending the pilot does not do:** it does not retroactively
  invalidate any claim already published under
  [CLAIMS-AND-MATURITY.md](../CLAIMS-AND-MATURITY.md)'s rules — an expired
  or withdrawn claim is corrected or removed per that policy, not silently
  left in place.

## 7. Publicity and claims

Any public statement by either party about the pilot's existence, scope, or
outcome must be reviewed by the other party before publication and must
comply with [CLAIMS-AND-MATURITY.md](../CLAIMS-AND-MATURITY.md) — scoped,
evidenced, dated, and carrying the solo-operator disclosure where
applicable (see [PILOT-READINESS-CLAIM.md](PILOT-READINESS-CLAIM.md) for an
example). Neither party will describe the pilot as a "production
deployment," a "partnership" implying more than the scope in Section 1, or
evidence of the other's endorsement beyond participating in this specific,
bounded pilot.

## 8. Governing law and jurisdiction

**Placeholder — must be filled in per the actual municipality's
jurisdiction and reviewed by counsel.** Do not proceed to signature with
this section blank or with a jurisdiction copied from an unrelated
template.

## 9. Signatures

**Placeholder.** Not for signature until Sections 5 and 8 have been
reviewed by counsel for both parties and Section 6's dates are filled in.

| Party | Name | Title | Date |
| --- | --- | --- | --- |
| localLOOP project | | | |
| Municipality | | | |
