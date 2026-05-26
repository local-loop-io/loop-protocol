# Implementation Guide

This guide summarizes the minimum steps to build a compatibility-oriented LOOP lab node. For normative requirements, follow `SPECIFICATION.md`.

## Executive summary for city decision-makers

This section is for city procurement, IT, and sustainability leads assessing LOOP before engaging with technical detail.

**What LOOP provides**: An open protocol for tracking material and product flows between city nodes — addressing traceability requirements under DIWASS, DPP readiness under ESPR, and packaging identification under PPWR, without locking cities into a proprietary platform.

**Staffing**: Running a lab node requires one to two technically capable staff (Linux / container administration). Integration with an existing ERP or waste-management system requires additional developer time; scope depends on the system.

**Infrastructure**: A minimal node runs on a single small VPS (2–4 vCPU, 4–8 GB RAM) with PostgreSQL, Redis, and an S3-compatible object store. Cloud or on-premises hosting are both viable.

**Cost**: Infrastructure is equivalent to a small web server. LOOP is open-source and royalty-free. Integration and customisation cost depends on existing systems.

**Data residency**: All city data stays on the city's own node. Federation exchanges anonymised material-flow metadata only — no raw records leave the node.

**Compliance note**: LOOP is a lab-demo project — not a certified compliance product. See the [Regulatory Alignment Roadmap](/docs/regulatory-alignment) for how LOOP maps to EU regulations, and the [DPIA Lite](/docs/dpia-lite) for the baseline data protection assessment.

---

## Minimum viable node
- HTTPS server with TLS 1.3+ and valid certificates.
- JSON-LD parsing and schema validation for all inbound payloads.
- Material registry storage and query capability.
- LoopCost calculator using the defined formula.
- Federation client for announce/offer flows.

## Core services
- **Material registry**: Create, read, search, and expire MaterialDNA records.
- **Signal governance**: Publish LoopSignalConfig and record LoopVote results.
- **LoopCoin engine**: Track balances, transfers, and inter-node settlement.
- **Transaction processor**: Create MaterialTransaction and Settlement records.

## Data storage
- Index by category, location, and availability for fast search.
- Store immutable audit trails for registrations and settlements.
- Archive expired materials to cold storage.

## Federation
- Maintain a NodeRegistry cache with health checks.
- Enforce request signatures, timestamps, and rate limits.
- Limit propagation (TTL and geographic radius) to avoid flooding.

## Validation and testing
- Validate all payloads against the JSON schemas in `schemas/`.
- Test LoopCost calculations and settlement distribution.
- Include integration tests for federated message exchange.

## Deployment checklist
- TLS certificates installed and renewed.
- Monitoring and alerting configured.
- Backups encrypted and restore-tested.
- Incident response plan in place.
