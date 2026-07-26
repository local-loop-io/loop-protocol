# LOOP

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/local-loop-io/loop-protocol/releases)
[![License](https://img.shields.io/badge/license-MIT%20%2B%20CC--BY--SA--4.0-green.svg)](LICENSE)
[![Discussions](https://img.shields.io/github/discussions/local-loop-io/loop-protocol)](https://github.com/local-loop-io/loop-protocol/discussions)
[![Specification](https://img.shields.io/badge/spec-v0.2-orange.svg)](SPECIFICATION.md)

Local Optimization with Overflow Protocol. A federated circular economy concept with shared schemas and interoperability notes.

> Early-stage, low-TRL concept. No public pilots or deployments. Lab demo only.

## What is here
- `SPECIFICATION.md`: core protocol spec.
- `schemas/`: JSON Schema definitions.
- `examples/`: sample payloads for interop.
- `contexts/`: JSON-LD contexts.
- `profiles/`: applicability profiles, including the lab-only Core-DP contract and conformance vectors.
- `docs/regulatory-alignment-roadmap.md`: long-horizon EU and German compatibility plan.
- `rfcs/`: RFCs and design notes.

## Quickstart
```bash
npm ci
npm run test
npm run check:domains
```

Use `npm run test`, not bare `npm test`: where `npm` is aliased to `bun`, the
bare form dispatches to Bun's built-in test runner instead of the validation
script. With Bun as your package manager, `bun install --frozen-lockfile` and
`bun run test` are the equivalents of the first two commands.

## Usage notes
- Specs and schemas are draft and subject to change.
- No certified implementations exist at this time.
- Use `examples/` to validate tooling and docs.
- Core-DP is a lab-only applicability profile, not a full LOOP conformance claim.

## Links
- Docs hub: https://localloop.urbnia.com
- Backend API: https://loop-api.urbnia.com

## Contributing
- Use `rfcs/` for feedback and proposals.
- See `../AGENTS.md` for org context and domain policy.

<!-- agent-cycle-036: protocol readme anchor -->
