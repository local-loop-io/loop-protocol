# Schemas

JSON Schema definitions for LOOP Protocol payloads.

## Files
- `material-dna.schema.json` (v0.1.1 minimal interop)
- `offer.schema.json` (v0.1.1 minimal interop)
- `match.schema.json` (v0.1.1 minimal interop)
- `transfer.schema.json` (v0.1.1 minimal interop)
- `handshake.schema.json` (v0.1.1 lab federation)
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
Alphin Tom. "LOOP Protocol Schemas." LocalLoop, GitHub repository, 2025-2026. https://github.com/local-loop-io/loop-protocol

```bibtex
@misc{localloop_protocol_schemas_2025,
  author = {Alphin Tom},
  title = {LOOP Protocol Schemas},
  year = {2025},
  howpublished = {GitHub repository},
  url = {https://github.com/local-loop-io/loop-protocol},
  note = {Accessed 2025-12-19}
}
```
