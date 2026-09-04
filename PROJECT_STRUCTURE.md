```text
loop-protocol/
├── README.md
├── SPECIFICATION.md
├── openapi.json
├── CHANGELOG.md
├── DOMAIN-POLICY.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
├── LICENSES/
│   ├── CC-BY-SA-4.0.txt
│   └── MIT.txt
├── PROJECT_STRUCTURE.md
├── package.json
├── package-lock.json
├── contexts/
│   ├── loop-v0.1.1.jsonld
│   └── loop-v0.2.0.jsonld
├── schemas/
│   ├── federate-accepted.schema.json
│   ├── handshake.schema.json
│   ├── loopcoin.schema.json
│   ├── loopsignal.schema.json
│   ├── match.schema.json
│   ├── material-dna.schema.json
│   ├── material-status.schema.json
│   ├── node-info.schema.json
│   ├── offer.schema.json
│   ├── product-dna.schema.json
│   ├── README.md
│   ├── transaction.schema.json
│   └── transfer.schema.json
├── examples/
│   ├── 01-material-registration.json
│   ├── 02-loopcoin-transfer.json
│   ├── 03-signal-voting.json
│   ├── 04-cross-city-trade.json
│   ├── 05-complete-flow.json
│   ├── 06-offer.json
│   ├── 07-match.json
│   ├── 08-transfer.json
│   ├── 09-handshake-request.json
│   ├── 10-material-status.json
│   ├── 11-handshake-response.json
│   ├── 12-material-dna-dpp-extensions.json
│   ├── 13-conformity-claims.json
│   ├── 14-product-reuse-registration.json
│   ├── 15-product-offer-flow.json
│   ├── 16-federate-accepted-response.json
│   ├── 17-battery-passport-material.json
│   ├── 18-packaging-transfer.json
│   ├── 19-waste-shipment-transfer.json
│   └── README.md
├── profiles/
│   ├── README.md
│   ├── battery/
│   │   ├── README.md
│   │   ├── conformance/
│   │   │   ├── README.md
│   │   │   ├── run-conformance.js
│   │   │   └── vectors/
│   │   │       └── battery-vectors.json
│   │   └── requirements/
│   │       └── battery-requirements.json
│   ├── core-dp/
│   │   ├── README.md
│   │   ├── conformance/
│   │   │   ├── README.md
│   │   │   ├── run-conformance.js
│   │   │   ├── trust/
│   │   │   │   └── accepted-peer-keys.json
│   │   │   └── vectors/
│   │   │       └── core-dp-vectors.json
│   │   ├── epcis/
│   │   │   ├── README.md
│   │   │   ├── unsupported-features.json
│   │   │   └── fixtures/
│   │   │       └── core-dp-transfer-object-event.json
│   │   ├── requirements/
│   │   │   ├── core-dp-requirements.json
│   │   │   └── spec-v0.2.0-normative-manifest.json
│   │   └── schemas/
│   │       ├── choreography-message.schema.json
│   │       ├── dna-operation.schema.json
│   │       ├── envelope.schema.json
│   │       ├── epcis-mapping.schema.json
│   │       ├── error.schema.json
│   │       ├── evidence-entry.schema.json
│   │       ├── peer-key-trust.schema.json
│   │       ├── search-contract.schema.json
│   │       └── trust-store.schema.json
│   ├── packaging/
│   │   ├── README.md
│   │   ├── conformance/
│   │   │   ├── README.md
│   │   │   ├── run-conformance.js
│   │   │   └── vectors/
│   │   │       └── packaging-vectors.json
│   │   └── requirements/
│   │       └── packaging-requirements.json
│   └── waste-shipment/
│       ├── README.md
│       ├── conformance/
│       │   ├── README.md
│       │   ├── run-conformance.js
│       │   └── vectors/
│       │       └── waste-shipment-vectors.json
│       └── requirements/
│           └── waste-shipment-requirements.json
├── docs/
│   ├── access-scope-model.md
│   ├── backup-restore-runbook.md
│   ├── category-classification-mapping.md
│   ├── faq.md
│   ├── federation-handshake.md
│   ├── glossary.md
│   ├── implementation-guide.md
│   ├── incident-response.md
│   ├── regulatory-alignment-roadmap.md
│   ├── retention-and-evidence-guidance.md
│   ├── secure-coding.md
│   ├── security-guide.md
│   ├── audit/
│   │   ├── discovery.md
│   │   ├── infrastructure-readiness.md
│   │   ├── requirements-matrix.md
│   │   ├── spec-implementation-divergence.md
│   │   ├── state-of-development.md
│   │   └── technical-debt.md
│   ├── compliance/
│   │   ├── dpia-lite.md
│   │   └── threat-model.md
│   └── governance/
│       ├── CLAIMS-AND-MATURITY.md
│       ├── GOVERNANCE.md
│       ├── RELEASE-CHECKLIST.md
│       ├── rfc-process.md
│       └── pilot-readiness/
│           ├── PILOT-READINESS-CLAIM.md
│           ├── PILOT-TERMS.md
│           ├── PILOT-USE-CASE.md
│           ├── README.md
│           └── SOLO-OPERATOR-ADDENDUM.md
├── rfcs/
│   ├── 0000-template.md
│   ├── 0001-rfc-process.md
│   ├── 0002-federation-handshake.md
│   ├── 0003-schema-versioning-policy.md
│   ├── 0004-smart-contract-integration.md
│   ├── 0005-solo-operator-governance-override.md
│   └── README.md
├── scripts/
│   ├── check-agent-markers.js
│   ├── check-domains.sh
│   ├── check-schemas-readme.js
│   ├── validate-schemas.js
│   └── lib/
│       └── profile-conformance-runner.js
└── .github/
    ├── dependabot.yml
    └── workflows/
        └── validate-schemas.yml
```

`bun.lock` (local, untracked) and `node_modules/` are generated and not part of the repository.

<!-- agent-cycle-037: structure anchor -->
