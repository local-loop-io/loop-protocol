# Schemas

JSON Schema definitions for LOOP payloads.

## Files
- `material-dna.schema.json` — Material identity and metadata (v0.2.0)
- `offer.schema.json` — Offer payload definition (v0.2.0)
- `match.schema.json` — Match payload definition (v0.2.0)
- `transfer.schema.json` — Transfer payload definition (v0.2.0)
- `material-status.schema.json` — Material status updates (v0.2.0)
- `handshake.schema.json` — Federation handshake protocol (v0.2.0)
- `loopcoin.schema.json`
- `loopsignal.schema.json`
- `transaction.schema.json`
- `node-info.schema.json`

## Validation
Use the validation script:

```bash
npm test
```

This validates all JSON files in `examples/` against the schemas.

## How to Cite

If you reference this repository, please cite:
Alphin Tom / Mycel UG (haftungsbeschränkt). "LOOP Schemas." localLOOP, 2025-2026. https://github.com/local-loop-io/loop-protocol

```bibtex
@misc{localloop_protocol_schemas_2025,
  author = {Alphin Tom / Mycel UG (haftungsbeschränkt)},
  title = {LOOP Schemas},
  year = {2025},
  howpublished = {GitHub repository},
  url = {https://github.com/local-loop-io/loop-protocol},
  note = {Accessed 2025-12-19}
}
```
