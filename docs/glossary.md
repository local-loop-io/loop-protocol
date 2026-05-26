# Glossary

Canonical definitions for the six key concepts are in SPECIFICATION.md §2.1. The entries below use the short-form §2 Terminology wording for quick reference.

## Key Concepts

- **LOOP (Local Optimization with Overflow Protocol)**: Open, federated protocol standard for tracking material and product flows between autonomous municipal nodes. See §2.1 for the full definition.
- **MaterialDNA**: Globally unique identifier for any material item or batch. See §2.1 for the full definition.
- **ProductDNA**: Globally unique identifier for a product or product batch, referencing constituent MaterialDNA entries. See §2.1 for the full definition.
- **LoopCoin (LC)**: Local digital currency with expiry properties. See §2.1 for the full definition.
- **LoopSignal**: Community-expressed preference percentage for material categories. See §2.1 for the full definition.
- **LoopCost**: Total cost including base price, export/import penalties, and distance. See §2.1 for the full definition.

## Protocol Terms

- **Node**: An autonomous LOOP implementation, typically operated by a municipality.
- **Federation**: Network of interconnected LOOP nodes.
- **Settlement**: Process of confirming material transfer and payment.
- **Inter-Node Settlement**: Cross-node clearing of LoopCoin transfers.
- **Penalty**: Additional cost applied when materials cross node boundaries.
- **Overflow**: Routing mechanism when local demand is insufficient.
- **Node Registry**: Published list of peer nodes and their endpoints/capabilities.
- **Signal Proposal**: Proposed change to LoopSignal values for a node.
- **LoopVote**: Recorded voting results for one or more proposals.

## City Operations Terms

- **Node Operator**: The municipality, cooperative, or authorised entity responsible for running and governing a LOOP node. Accountable for data governance, security configuration, and federation decisions.
- **Audit Trail**: The immutable sequence of material registration, offer, match, and transfer events recorded by a node. Used for EPR reporting and traceability evidence.
- **Federation**: The peer-to-peer mechanism by which LOOP nodes discover each other and exchange material-flow metadata across boundaries without central control.
- **Data Residency**: The property that a city's material and product records remain stored within its own node infrastructure. Federation exchanges agreed anonymised metadata only, not raw records.
- **Governance**: The RFC-based process by which protocol changes, new schema modules, and policy decisions are proposed, reviewed, and adopted by the LOOP community.
