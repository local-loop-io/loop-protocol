# Examples

This directory contains JSON examples that validate against the schemas in `schemas/`.

## Files
- `01-material-registration.json`: MaterialDNA registration payload.
- `02-loopcoin-transfer.json`: LoopCoin transfer example.
- `03-signal-voting.json`: LoopVote record.
- `04-cross-city-trade.json`: MaterialTransaction example.
- `05-complete-flow.json`: Array of objects representing a full flow.
- `06-offer.json`: Minimal interop offer payload (v0.1.1).
- `07-match.json`: Minimal interop match payload (v0.1.1).
- `08-transfer.json`: Minimal interop transfer payload (v0.1.1).
- `09-handshake-request.json`: Node handshake request payload.
- `10-material-status.json`: Material status update payload (v0.1.1 lab demo).
- `11-handshake-response.json`: Node handshake response payload.
- `12-material-dna-dpp-extensions.json`: MaterialDNA with comprehensive DPP passport fields (v0.2.0).
- `13-conformity-claims.json`: MaterialDNA with multiple conformity claims (v0.2.0).
- `14-product-reuse-registration.json`: ProductDNA registration for office furniture reuse (v0.2.0).
- `15-product-offer-flow.json`: Complete Offer→Match→Transfer flow using product_id (v0.2.0).
- `16-federate-accepted-response.json`: 202 Accepted response body for `POST /api/v1/federate/announce` and `POST /api/v1/federate/offer` (v0.2.0).
- `17-battery-passport-material.json`: MaterialDNA for an industrial battery pack, worked example for [profiles/battery](../profiles/battery/README.md) (v0.2.0).
- `18-packaging-transfer.json`: Transfer of reusable transport packaging, worked example for [profiles/packaging](../profiles/packaging/README.md) (v0.2.0).
- `19-waste-shipment-transfer.json`: Transfer with a DIWASS waste-shipment document reference, worked example for [profiles/waste-shipment](../profiles/waste-shipment/README.md) (v0.2.0).

## Validation
Run `npm run test` from the repository root to validate all examples.

## How to Cite

If you reference this repository, please cite:
Alphin C. Tom. "LOOP Examples." localLOOP (Mycel), 2025-2026. https://github.com/local-loop-io/loop-protocol

```bibtex
@misc{localloop_protocol_examples_2025,
  author = {Alphin C. Tom},
  organization = {Mycel},
  title = {LOOP Examples},
  year = {2025},
  howpublished = {GitHub repository},
  url = {https://github.com/local-loop-io/loop-protocol},
  note = {Accessed 2025-12-19}
}
```
