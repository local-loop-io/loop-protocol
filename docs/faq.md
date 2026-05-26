# FAQ

## What is LOOP?
LOOP is a federated protocol for tracking materials, settling exchanges, and coordinating circular economy flows between autonomous city nodes.

## Who can run a LOOP node?
Any municipality, cooperative, or authorized operator can run a node, provided they meet the security and compliance requirements in the specification.

## What is MaterialDNA?
MaterialDNA is the globally unique identifier and metadata record for a material item or batch.

## Do nodes have to use LoopCoin?
LoopCoin is part of the core protocol for settlement. Implementations can support additional currencies, but LoopCoin is required for interoperability.

## How are LoopSignals decided?
Each node publishes community-defined signals through a local voting process and exposes them via the required endpoints.

## How do I propose changes to the protocol?
Open a discussion, then submit an RFC using the template in `rfcs/0000-template.md`.

## Where are the schemas and examples?
Schemas are in `schemas/` and validated examples are in `examples/`.

## For city decision-makers

### What does it cost for a city to run a LOOP node?

Running a LOOP lab node requires a modest server (a small VPS or bare-metal host), a PostgreSQL-compatible database, a Redis-compatible cache, and an S3-compatible object store. In the lab configuration, these run as Docker containers on a single VPS. Infrastructure costs scale with material-flow volume and data retention requirements. The LOOP protocol is open-source and royalty-free. Integration cost with an existing ERP or waste-management system depends on your current IT setup; the implementation guide provides a minimum-viable checklist.

### How does LOOP handle GDPR and data residency?

LOOP protocol payloads are designed to carry no personal data in their core fields. Personal contact information is intentionally excluded from shared payloads. Each city node stores its own data under its own jurisdiction — federation only exchanges anonymised material-flow metadata. A baseline DPIA Lite for the lab demo is published at `/docs/dpia-lite`. Cities should supplement this with their own full DPIA based on their specific node configuration and applicable national law.

### What is the governance model for protocol changes?

Protocol changes follow a public RFC process. Any participant can open a discussion and submit a Request for Comments using the template in `rfcs/0000-template.md`. Major changes require community review before adoption. Current governance documents are at `/governance`.

### When do EU mandates start, and how should cities prepare?

Several regulations are already applying or beginning in 2026:

- **DIWASS** (Digital Waste Shipment System, WSR Art. 26) applies from **May 2026** — electronic documentation is now required for cross-border waste shipments.
- **PPWR** (Packaging Regulation (EU) 2025/40) applies from **August 2026** — harmonised packaging identification and reusable packaging tracking begin.
- **Battery Passport** (Regulation (EU) 2023/1542) obligations start **February 2027** — city fleets managing EV or industrial batteries should plan now.
- **ESPR/DPP** delegated acts covering textiles and furniture are expected **2026–2027**.

See the Regulatory Alignment Roadmap for full details and city-specific action notes.
