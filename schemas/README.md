# Schemas

JSON Schema definitions for LOOP payloads.

## Files
- `material-dna.schema.json` — Material identity and metadata (v0.2.0)
- `product-dna.schema.json` — Product identity and metadata, DPP-aligned (v0.2.0)
- `offer.schema.json` — Offer payload definition (v0.2.0, supports material_id or product_id)
- `match.schema.json` — Match payload definition (v0.2.0, supports material_id or product_id)
- `transfer.schema.json` — Transfer payload definition (v0.2.0, supports material_id or product_id)
- `material-status.schema.json` — Material status updates (v0.2.0)
- `handshake.schema.json` — Federation handshake protocol (v0.2.0)
- `federate-accepted.schema.json` — 202 Accepted response for federate announce/offer (v0.2.0)
- `loopcoin.schema.json` — forward-looking/reserved schema; LoopCoin settlement has no corresponding route, schema, or data model in `localloop-backend` yet (see `localloop-backend/docs/SPEC-COMPLIANCE.md`'s LoopCoin settlement lab-boundary section for the current implementation-status boundary)
- `loopsignal.schema.json`
- `transaction.schema.json`
- `node-info.schema.json`

## Validation

Run the validation suite from the repository root (agent-cycle-027):

```bash
npm run test
```

This validates all JSON files in `examples/` against the schemas.

> Use `npm run test` rather than bare `npm test`. Where `npm` is aliased to
> `bun`, bare `npm test` invokes Bun's built-in test runner — which finds no
> test files here and exits non-zero — instead of this validation script.

## How to Cite

If you reference this repository, please cite:
Mycel UG (haftungsbeschränkt). "LOOP Schemas." localLOOP, 2025-2026. https://github.com/local-loop-io/loop-protocol

```bibtex
@misc{localloop_protocol_schemas_2025,
  author = {Mycel UG (haftungsbeschränkt)},
  title = {LOOP Schemas},
  year = {2025},
  howpublished = {GitHub repository},
  url = {https://github.com/local-loop-io/loop-protocol},
  note = {Accessed 2025-12-19}
}
```
