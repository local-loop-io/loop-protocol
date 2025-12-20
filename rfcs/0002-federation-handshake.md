# RFC-0002: Federation Handshake (Lab Only)

## Summary
Introduce a minimal federation handshake payload for lab environments to
exchange node metadata and confirm protocol compatibility.

## Motivation
Multi-node demos require a clear, documented handshake to show how nodes
announce themselves without implying production readiness.

## Proposal
Add a `NodeHandshake` request and `NodeHandshakeResponse` schema (v0.1.1)
with a strict `lab_only: true` marker in responses.

## Security & Privacy
- Handshake signatures are optional placeholders.
- No PII is required.
- Production-grade mutual TLS and signing are deferred.

## Backwards Compatibility
No breaking changes; this is a new schema for lab-only use.

## Implementation Plan
1. Add handshake schema + examples.
2. Publish a lab-only handshake endpoint in the demo backend.
3. Document in the docs hub and governance index.

## Alternatives Considered
- Reuse NodeInfo schema (rejected: lacks handshake semantics).

## Open Questions
None for v0.1.
