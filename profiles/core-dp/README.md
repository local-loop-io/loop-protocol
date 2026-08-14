# Core-DP Applicability Profile 0.1.0-lab

**Status:** LAB ONLY contract foundation  
**Profile version:** `0.1.0-lab`  
**Pinned base specification:** `SPECIFICATION.md` v0.2.0  
**Conformance claim:** Core-DP profile conformance only. This is explicitly **not** full LOOP conformance.

Core-DP is the smallest machine-checkable delivery profile for two controlled lab nodes. It narrows the broad LOOP v0.2.0 draft to discovery, DNA registry/read/search, Offer -> Match -> Transfer choreography, signed two-node messages, append-only evidence, version negotiation, and errors.

Core-DP does not claim blockchain permanence, production security, public pilot readiness, payment settlement, legal DPP conformance, VC/DID conformance, or generalized federation safety.

## Scope Classification

| Area | Core-DP status | Rationale |
| --- | --- | --- |
| Node and capability discovery | IN | Required before a lab node can decide whether the peer supports `core-dp` and the pinned profile version. |
| MaterialDNA register/read/search | IN | Minimal material identity surface for lab transfer demos. |
| ProductDNA register/read/search | IN | ProductDNA exists in v0.2.0 and must have parity with MaterialDNA for the profile. |
| Offer -> Match -> Transfer | IN | The minimum exchange choreography needed for two-node delivery. |
| Append-only evidence | IN | Required for lab auditability and conformance harness replay. This is append-only storage, not immutable-chain permanence. |
| Signed two-node delivery | IN | Required for deterministic lab authentication, replay checks, idempotency, and duplicate handling. |
| Errors and version negotiation | IN | Required for predictable interop failures. |
| LoopSignal | OUT | Governance voting and preference calculation are outside Core-DP delivery. Existing v0.2.0 statements are not profiled here. |
| LoopCost | OUT | Cost optimization is not required for delivery contract proof and depends on LoopSignal/settlement semantics. |
| Transactions | OUT | v0.2.0 transaction objects imply settlement semantics that Core-DP does not implement. |
| LoopCoin | OUT | Currency issuance, clearing, decay, and payment are outside the lab delivery foundation. |
| Voting | OUT | Democratic governance is a future governance profile, not part of two-node delivery. |
| Payments | OUT | No payment authorization, clearing, custody, or production financial control is claimed. |
| Generalized federation | DEFERRED | Core-DP is exactly two nodes. Flooding, peer meshes, and multi-hop convergence need a later profile. |
| VC/DID/DPP profiles | DEFERRED | Core-DP may carry opaque references, but it does not validate or claim legal/standards conformance for these profiles. |
| EPCIS/CBV | DEFERRED | Core-DP pins a conservative mapping subset for fixtures only; it does not claim full EPCIS conformance. |

## Version Reconciliation

The repository package release is `0.3.0`, while the normative base specification remains pinned at `0.2.0`. Core-DP treats this as:

- package `0.3.0`: repository maintenance release containing docs, examples, schema corrections, and validation tooling;
- spec `0.2.0`: pinned normative text inventoried by `profiles/core-dp/requirements/spec-v0.2.0-normative-manifest.json`;
- profile `0.1.0-lab`: additive applicability profile that narrows v0.2.0 for lab delivery without changing v0.2.0 semantics or schema IDs.

## Two-Node Authority and Convergence

Core-DP has exactly two nodes: `origin_node` and `counterparty_node`. Each choreography message carries both `authoritative_role` (`origin` or `counterparty`) and `authoritative_node`; the schema fixes the role for each message type, and the conformance harness verifies `authoritative_node` equals the node named by that role.

| Step | Authoritative node | Accepted inputs | Terminal states | Convergence rule |
| --- | --- | --- | --- | --- |
| `capabilities.announce` | Origin node advertises; receiving node decides compatibility | `capabilities.response` | `capabilities-confirmed`, `offer-rejected` via version error | Both nodes converge when each stores the same accepted profile version and peer key id. |
| `offer.publish` | Origin node that owns the MaterialDNA/ProductDNA record | `offer.ack` or `offer.reject` authored by the counterparty/receiver | `offer-acked`, `offer-rejected`, `timed-out` | Publication is origin-authored. Offer ack/reject is receiver-authored and authoritative for the receiver's acceptance decision. |
| `match.propose` | Origin node proposes the selected match after offer acknowledgement | `match.accept` or `match.reject` authored by the counterparty/receiver | `match-accepted`, `match-rejected`, `timed-out` | A match is active only after the receiver accepts and both nodes store the matching evidence hash. |
| `transfer.dispatch` | Origin node dispatches; receiving node records receipt facts | `transfer.receive` authored by the counterparty/receiver, then `transfer.ack` authored by the origin | `transfer-acked`, `timed-out`, `partitioned` | Dispatch facts are authoritative at origin; receipt facts are authoritative at receiver; final ack is `origin-confirms-receiver-receipt` and requires matching transfer id, subject id, and evidence hashes on both nodes. |

Retries use the same `idempotency_key` and increasing `attempt` values from 1 through 5. A duplicate with the same `idempotency_key` and identical signing input returns the stored result. A duplicate with the same `idempotency_key` and different signing input is `conflict`. Reordered messages are accepted only when their `previous_state` matches local state; otherwise the receiver returns `conflict` or `stale_message` and includes its authoritative state.

Timeouts and partitions are conformant local recovery observations over the last accepted choreography action, not new contradictory action states. A `timed-out` or `partitioned` observation keeps the original action's authority and sender role, sets `terminal: true`, names the accepted action state in `previous_state`, and carries `last_accepted_message_id` so reconciliation can compare append-only evidence by `(subject.id, sequence, payload_hash_sha256)`. Recovery observations are not duplicate retry results and cannot carry `duplicate_of`, `duplicate_behavior`, or duplicate fingerprint result fields; retries remain governed by the shared `idempotency_key`, incrementing `attempt`, and `duplicate_of` rules above. `transfer.ack` is a final acknowledgement, not a recovery observation. Terminal states cannot return to non-terminal states. For transfer finality, `transfer-acked` is the only convergence exception over a local timeout when the ack was created before the timeout, explicitly acknowledges `transfer.receive`, validates against the same dispatch, and carries equal local and peer transfer evidence hashes. The convergence hash is `sha256(subject.id + ":" + local_evidence_hash_sha256 + ":" + peer_evidence_hash_sha256)`.

Key rotation is announced as evidence event `key-rotated`. Old keys remain valid only for messages with `created_at` before the rotation event and inside their replay window. New messages after rotation use the new `key_id`; peers reject messages signed by revoked keys with `signature_invalid`.

## Search Contract

Core-DP defines local and cross-node search for MaterialDNA and ProductDNA through `search-contract.schema.json`. The base OpenAPI contract preserves the existing Material search shape and adds `POST /api/v1/product/search` as the profile path for ProductDNA search parity; the Product search operation references the profile's `searchRequest` and `searchResponse` definitions directly.

Allowed filters are `category_prefix`, `id_prefix`, `origin_city`, `current_city`, `available_from_gte`, `available_from_lt`, `quantity_min`, `condition`, and `updated_since`. Product search may use `condition`; material search ignores it with `invalid_request` if strict filtering is enabled.

Authorization modes are `public-lab`, `bearer`, and `node-signature`. Cross-node search requires an `auth` object with `auth.mode=node-signature`; local search keeps `public-lab` and `bearer` modes. Results are limited to 100 records. Ordering is by `updated_at_asc` with `id_asc` as the stable tie-break. Cursors are opaque `cur_...` tokens bound to the original filters, ordering, and consistency mode.

Local search can be `snapshot` or `eventual`. Cross-node requests are `eventual`; a cross-node response may claim `snapshot` only when it includes a shared `snapshot_id`. Every result carries `source_node`, `record_hash_sha256`, and `updated_at`; responses list queried and omitted nodes.

## DNA Operations

`dna-operation.schema.json` defines minimal machine-checkable MaterialDNA and ProductDNA register/read requests and results. Register requests compose the pinned v0.2.0 `material-dna.schema.json` and `product-dna.schema.json`; read requests use profile-level id patterns. Results carry `source_node`, `record_hash_sha256`, `recorded_at`, and optional evidence/envelope references. Error results reuse `error.schema.json`. Core-DP treats ProductDNA `material_ids` composition and ProductDNA Offer -> Match -> Transfer participation as IN. External legal DPP, VC, and DID profile validation remains DEFERRED.

## Signed Envelope

`envelope.schema.json` defines the canonical lab envelope. The deterministic signing input is canonical JSON with lexicographically sorted object keys over:

```json
{
  "profile": "...",
  "profile_version": "...",
  "message_id": "...",
  "message_type": "...",
  "created_at": "...",
  "expires_at": "...",
  "sender": {...},
  "receiver": {...},
  "idempotency_key": "...",
  "body_schema": "...",
  "body": {...}
}
```

The supported lab algorithm is `Ed25519-lab-detached-v1` with an OKP Ed25519 JWK public key. `signature.value` is the base64url detached Ed25519 signature over the canonical UTF-8 JSON signing input above. Every envelope requires `replay_window_seconds`; the semantic check enforces `created_at < expires_at <= created_at + replay_window_seconds`. The conformance harness verifies deterministic `signing_input_sha256`, requires `signature.key_id` to match `sender.key_id`, checks the advertised lab key-binding metadata, verifies the detached signature with the public JWK, and requires valid signed-envelope vectors to run hash, crypto, body-contract, and replay checks.

Cryptographic validity is not trust by itself. Implementations bind the advertised `key_id` and public JWK to the accepted peer capability/key lifecycle, reject unbound or revoked keys, and treat the included key-binding fields as lab-scope evidence of that accepted peer binding rather than a production PKI.

The additive Product search OpenAPI operation keeps three authentication alternatives: public lab access, Bearer auth, or one node-signature security requirement containing `X-Node-Signature`, `X-Node-Key-Id`, and `X-Node-Signature-Input-SHA256` together. Partial node-signature headers are not a valid generated-client contract.

## Evidence

`evidence-entry.schema.json` defines append-only evidence. The immutable subset is `event_id`, `sequence`, `subject`, `event_type`, and `payload_hash_sha256`. Redaction can remove mutable/export fields or create a tombstone, but it cannot rewrite the immutable subset. Retention/export/redaction fields are required so lab operators can test evidence export without claiming indefinite permanence.

The `status-updated` event type records `MaterialStatusUpdate` (base protocol, `material-status.schema.json`) against its `material` subject. This keeps availability-status changes inside the same append-only, retention-bearing trail as register/offer/match/transfer events, even though `MaterialStatusUpdate` itself is a base-protocol lab-demo extension rather than a Core-DP choreography step. See [Retention and Evidence Guidance](../../docs/retention-and-evidence-guidance.md) for how retention windows and evidence references apply to transfer and status events.

## EPCIS and CBV Pin

Core-DP pins **EPCIS 2.0.1** and **CBV 2.0** for conservative mapping fixtures only. Supported fixture mapping is limited to object-style lifecycle events for register, offer, match, and transfer evidence. Unsupported EPCIS features are listed in `epcis/unsupported-features.json`. No full EPCIS conformance is claimed.
