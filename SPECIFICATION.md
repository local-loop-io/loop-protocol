# LOOP Protocol Specification v0.1.1

**Local Optimization with Overflow Protocol**

*Draft Specification - Request for Comments*

**Version:** 0.1.1  
**Status:** Draft (Lab Demo Baseline)  
**Updated:** December 2025  
**License:** CC BY-SA 4.0  

## Table of Contents

1. [Introduction](#1-introduction)
2. [Terminology](#2-terminology)
3. [Protocol Overview](#3-protocol-overview)
3.5. [Minimal Interop Flow v0.1.1](#35-minimal-interop-flow-v011)
4. [MaterialDNA Specification](#4-materialdna-specification)
5. [LoopCoin Specification](#5-loopcoin-specification)
6. [LoopSignal Specification](#6-loopsignal-specification)
7. [LoopCost Calculation](#7-loopcost-calculation)
8. [API Endpoints](#8-api-endpoints)
9. [Federation Protocol](#9-federation-protocol)
10. [Security Considerations](#10-security-considerations)
11. [Implementation Guidance](#11-implementation-guidance)
12. [Examples](#12-examples)
13. [Future Considerations](#13-future-considerations)
14. [References](#14-references)

---

## Abstract

The Local Optimization with Overflow Protocol (LOOP) enables federated material exchange between autonomous municipal nodes while preserving local economic sovereignty. This specification defines the core protocol for inter-city communication, material identification, economic settlement, and democratic governance mechanisms that together create a planetary-scale circular economy infrastructure.

LOOP allows cities to:
- Track materials using universal identifiers (MaterialDNA)
- Issue local currencies with defined properties (LoopCoin)
- Express community trade preferences (LoopSignal)
- Calculate optimal material routing (LoopCost)
- Settle transactions across municipal boundaries

This document specifies LOOP Protocol version 0.1.1, focusing on core functionality required for basic interoperability and lab-only demos.

---

## 1. Introduction

### 1.1 Background

Current material recovery systems operate in isolation, leading to suboptimal resource allocation and missed opportunities for circular economy implementation. Cities lack infrastructure to coordinate material flows while maintaining local control over their economies.

The LOOP Protocol addresses these challenges by providing:
- Federated architecture that preserves local autonomy
- Economic incentives for circular behaviors
- Democratic mechanisms for community preferences
- Transparent routing algorithms
- Open standards for interoperability

### 1.2 Goals

LOOP Protocol aims to:
1. Enable any city to participate in global material exchange
2. Preserve local economic sovereignty
3. Optimize material flows through market mechanisms
4. Incorporate democratic community preferences
5. Create transparent, auditable transactions
6. Support multiple implementation approaches

### 1.3 Scope

This specification covers:
- Protocol message formats
- Required API endpoints  
- Calculation methodologies
- Settlement procedures
- Security requirements

This specification does NOT cover:
- Local implementation details
- User interface requirements
- Specific database schemas
- Local governance procedures
- Business logic beyond protocol requirements

### 1.4 Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

---

## 2. Terminology

**Node**: An autonomous LOOP implementation, typically operated by a municipality

**MaterialDNA**: Globally unique identifier for any material item or batch

**LoopCoin (LC)**: Local digital currency with expiry properties

**LoopSignal**: Community-expressed preference percentage for material categories

**LoopCost**: Total cost including base price, export/import penalties, and distance

**Federation**: Network of interconnected LOOP nodes

**Settlement**: Process of confirming material transfer and payment

**Penalty**: Additional cost applied when materials cross city boundaries

**Overflow**: Routing mechanism when local demand is insufficient

---

## 3. Protocol Overview

### 3.1 Architecture

LOOP follows a federated architecture where each city operates an autonomous node. Nodes communicate using HTTPS and JSON-LD messages.

```bash

┌─────────────┐ ┌─────────────┐ │ Munich │◄────────┤ Berlin │ │ Node │ HTTPS │ Node │ └──────┬──────┘ └──────┬──────┘ │ │ │ ┌─────────────┐ │ └────┤ Vienna ├────┘ │ Node │ └─────────────┘

```
### 3.2 Core Components

Each LOOP node MUST implement:

1. **Material Registry**: Tracks MaterialDNA within node jurisdiction
2. **Currency Engine**: Manages LoopCoin issuance and transfers
3. **Signal Governor**: Handles democratic voting on preferences
4. **Routing Calculator**: Computes optimal destinations using LoopCost
5. **Settlement Handler**: Confirms and records transactions

### 3.3 Communication Flow

Standard material exchange flow:

1. **Registration**: Material registered with unique MaterialDNA
2. **Announcement**: Availability broadcast to federated nodes
3. **Discovery**: Interested nodes discover available materials
4. **Calculation**: Each node calculates their LoopCost
5. **Offer**: Nodes submit offers to material owner
6. **Selection**: Optimal match determined by lowest/highest LoopCost
7. **Settlement**: Transaction executed and confirmed
8. **Confirmation**: Final state broadcast to network

### 3.4 Data Format

All protocol messages MUST use:
- **Transport**: HTTPS (TLS 1.3 or higher)
- **Content-Type**: `application/ld+json`
- **Encoding**: UTF-8
- **Timestamps**: ISO 8601 format in UTC

---

### 3.5 Minimal Interop Flow v0.1.1

This subsection defines the smallest interoperable flow required for lab-only demonstrations. It is intentionally minimal, scoped to controlled environments, and **does not represent a public pilot**.

#### Flow sequence
1. **MaterialDNA** is registered by a node.
2. **Offer** is published for that material.
3. **Match** is accepted between two nodes.
4. **Transfer** is completed and recorded.

#### Required entities

All payloads MUST include `@context`, `@type`, and `schema_version` set to `0.1.1`.

- **MaterialDNA**  
  Schema: `https://loop-protocol.org/schemas/v0.1.1/material-dna.schema.json`
- **Offer**  
  Schema: `https://loop-protocol.org/schemas/v0.1.1/offer.schema.json`
- **Match**  
  Schema: `https://loop-protocol.org/schemas/v0.1.1/match.schema.json`
- **Transfer**  
  Schema: `https://loop-protocol.org/schemas/v0.1.1/transfer.schema.json`

#### Data minimization

To remain GDPR-aligned for lab demos, payloads **MUST NOT** include personal data. Node identifiers, city names, and organization identifiers are permitted; emails, phone numbers, and names are not permitted in these entities.

---

## 4. MaterialDNA Specification

### 4.1 Identifier Format

MaterialDNA identifiers MUST follow this pattern:

```bash
{COUNTRY}-{CITY}-{YEAR}-{CATEGORY}-{UNIQUE}
```

Where:
- `COUNTRY`: ISO 3166-1 alpha-2 code
- `CITY`: Three-letter city code (locally defined)
- `YEAR`: Four-digit year of registration
- `CATEGORY`: Material category code
- `UNIQUE`: Alphanumeric unique identifier (min 6 characters)

Example:

```bash
DE-MUC-2025-PLASTIC-B847F3
```

### 4.2 MaterialDNA Object

```json
{
  "@context": "https://loop-protocol.org/v0.1.1",
  "@type": "MaterialDNA",
  "schema_version": "0.1.1",
  "id": "DE-MUC-2025-PLASTIC-B847F3",
  "category": "plastic-pet",
  "quantity": {
    "value": 1000,
    "unit": "kg"
  },
  "quality": 0.95,
  "origin_city": "Munich",
  "current_city": "Munich",
  "location": {
    "lat": 48.1351,
    "lon": 11.5820,
    "address": "Recycling Center Munich"
  },
  "available_from": "2025-05-27T10:00:00Z",
  "expires": "2025-06-03T10:00:00Z",
  "certifications": ["food-grade", "iso-14001"],
  "images": ["https://example.com/material-photo.jpg"],
  "metadata": {
    "source": "consumer-collection",
    "batch_number": "2025-W22-01",
    "notes": "Clean, sorted PET bottles"
  }
}
```

### 4.3 Required Fields

- `schema_version`: Schema version (v0.1.1)
- `id`: Unique MaterialDNA identifier
- `category`: Standardized category code
- `quantity`: Amount and unit
- `origin_city`: Registering city
- `current_city`: Current custodian city
- `available_from`: When material becomes available

### 4.4 Standard Categories

Base categories (extensible by communities):

```
plastics/
  plastic-pet     # Polyethylene terephthalate
  plastic-hdpe    # High-density polyethylene
  plastic-pvc     # Polyvinyl chloride
  plastic-ldpe    # Low-density polyethylene
  plastic-pp      # Polypropylene
  plastic-ps      # Polystyrene
  plastic-mixed   # Mixed/unsorted plastics

metals/
  metal-steel     # Steel and iron
  metal-aluminum  # Aluminum
  metal-copper    # Copper
  metal-mixed     # Mixed metals

organics/
  organic-food    # Food waste
  organic-garden  # Garden waste
  organic-wood    # Wood waste

glass/
  glass-clear     # Clear glass
  glass-brown     # Brown glass
  glass-green     # Green glass
  glass-mixed     # Mixed glass

paper/
  paper-clean     # Clean paper
  paper-newsprint # Newspapers
  cardboard       # Cardboard
  paper-mixed     # Mixed paper

textiles/
  textile-cotton  # Cotton
  textile-wool    # Wool
  textile-synthetic # Synthetic fabrics
  textile-mixed   # Mixed textiles

electronics/
  ewaste-computers # Computers and peripherals
  ewaste-phones   # Mobile phones
  ewaste-batteries # Batteries
  ewaste-mixed    # Mixed electronics
```

---

## 5. LoopCoin Specification

### 5.1 Currency Properties

Each node's LoopCoin configuration:

```json
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "LoopCoinConfig",
  "issuer": "munich.loop",
  "currency_code": "LC-MUC",
  "backed_by": "EUR",
  "exchange_rate": 1.0,
  "local_bonus": 0.05,
  "expiry_months": 6,
  "decay_rate": 0.05,
  "max_issuance": 1000000,
  "current_supply": 450000,
  "reserve_ratio": 1.0
}
```

### 5.2 Transaction Format

```json
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "LoopCoinTransfer",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "from": "user:maria@munich.loop",
  "to": "business:brewery@munich.loop",
  "amount": 50,
  "currency": "LC-MUC",
  "material_ref": "DE-MUC-2025-FOOD-B847F3",
  "timestamp": "2025-05-27T14:30:00Z",
  "memo": "Payment for spent grain",
  "signature": "..."
}
```

### 5.3 Inter-Node Settlement

When LoopCoins cross node boundaries:

```json
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "InterNodeSettlement",
  "from_node": "munich.loop",
  "to_node": "berlin.loop",
  "transfers": [
    {
      "from": "business:brewery@munich.loop",
      "to": "business:biogas@berlin.loop",
      "amount": 65,
      "from_currency": "LC-MUC",
      "to_currency": "LC-BER",
      "exchange_rate": 1.0,
      "fees": {
        "export_penalty": 26,
        "import_penalty": 0,
        "distance_cost": 12
      }
    }
  ],
  "settlement_method": "clearing",
  "settlement_period": "daily"
}
```

---

## 6. LoopSignal Specification

### 6.1 Signal Configuration

Community preferences for material categories:

```json
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "LoopSignalConfig",
  "node": "munich.loop",
  "signals": {
    "plastic-pet": 0.30,
    "plastic-hdpe": 0.25,
    "metal-aluminum": 0.15,
    "organic-food": 0.40,
    "glass-clear": 0.10,
    "paper-clean": 0.05,
    "ewaste-phones": 0.35,
    "default": 0.05
  },
  "valid_from": "2025-06-01T00:00:00Z",
  "valid_until": "2025-06-30T23:59:59Z",
  "approved_by": {
    "vote_id": "2025-05-vote",
    "turnout": 0.35,
    "approval": 0.68
  }
}
```

### 6.2 Signal Constraints

- Values MUST be between 0.0 and 1.0 (0% to 100%)
- Changes MUST NOT exceed 0.10 (10%) per voting period
- Nodes MUST publish signals publicly
- Signals MUST apply equally to imports and exports

### 6.3 Voting Record

```json
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "LoopVote",
  "node": "munich.loop",
  "vote_id": "2025-05-plastic-increase",
  "proposals": [
    {
      "category": "plastic-pet",
      "current_value": 0.20,
      "proposed_value": 0.30,
      "rationale": "Increase local plastic recycling"
    }
  ],
  "voting_period": {
    "start": "2025-05-01T00:00:00Z",
    "end": "2025-05-07T23:59:59Z"
  },
  "results": {
    "total_eligible": 150000,
    "total_voted": 52500,
    "votes_for": 35700,
    "votes_against": 16800,
    "status": "passed"
  }
}
```

---

## 7. LoopCost Calculation

### 7.1 Formula

The LoopCost for any material transaction:

```
LoopCost = BasePrice + ExportPenalty + ImportPenalty + DistanceCost
```

Where:

- `BasePrice`: Offered price in LoopCoins
- `ExportPenalty`: BasePrice × OriginSignal (if leaving origin)
- `ImportPenalty`: BasePrice × DestinationSignal (if entering destination)
- `DistanceCost`: Distance_km × 0.02 LC/km

### 7.2 Calculation Rules

1. **Local transactions** (same node): Only BasePrice applies
2. **Export penalty**: Applied to seller's community fund
3. **Import penalty**: Applied to buyer's community fund
4. **Distance cost**: Split between nodes or transport provider

### 7.3 Reference Implementation

```javascript
function calculateLoopCost(offer) {
  const { basePrice, origin, destination, materialType, distance } = offer;
  
  let loopCost = basePrice;
  let exportPenalty = 0;
  let importPenalty = 0;
  let distanceCost = 0;
  
  // Export penalty if material leaves origin
  if (origin.node !== destination.node) {
    const exportSignal = origin.getSignal(materialType);
    exportPenalty = basePrice * exportSignal;
    loopCost += exportPenalty;
  }
  
  // Import penalty if material enters destination
  if (destination.node !== origin.node) {
    const importSignal = destination.getSignal(materialType);
    importPenalty = basePrice * importSignal;
    loopCost += importPenalty;
  }
  
  // Distance cost (simplified)
  if (distance > 0) {
    distanceCost = distance * 0.02;
    loopCost += distanceCost;
  }
  
  return {
    total: loopCost,
    breakdown: {
      base: basePrice,
      export: exportPenalty,
      import: importPenalty,
      distance: distanceCost
    }
  };
}
```

### 7.4 Settlement Distribution

For cross-node transactions:

```
Total Payment = LoopCost
├── Seller receives: BasePrice - ExportPenalty
├── Origin community fund: ExportPenalty
├── Destination community fund: ImportPenalty
└── Transport/Network: DistanceCost
```

---

## 8. API Endpoints

### 8.1 Required Endpoints

All LOOP nodes MUST implement these RESTful endpoints:

#### Material Management

**POST /api/v1/material**

```http
POST /api/v1/material
Content-Type: application/ld+json
Authorization: Bearer {token}

{
  "@context": "https://loop-protocol.org/v1",
  "@type": "MaterialDNA",
  "id": "DE-MUC-2025-PLASTIC-B847F3",
  "category": "plastic-pet",
  "quantity": {"value": 1000, "unit": "kg"},
  ...
}

Response: 201 Created
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "MaterialDNA",
  "id": "DE-MUC-2025-PLASTIC-B847F3",
  "status": "registered",
  ...
}
```

**GET /api/v1/material/{id}**

```http
GET /api/v1/material/DE-MUC-2025-PLASTIC-B847F3

Response: 200 OK
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "MaterialDNA",
  "id": "DE-MUC-2025-PLASTIC-B847F3",
  ...
}
```

**POST /api/v1/material/search**

```http
POST /api/v1/material/search
Content-Type: application/ld+json

{
  "category": "plastic-*",
  "radius_km": 100,
  "min_quantity": 500,
  "max_loop_cost": 150
}

Response: 200 OK
{
  "results": [...],
  "total": 15,
  "next": "/api/v1/material/search?page=2"
}
```

#### Node Information

**GET /api/v1/node/info**

```http
GET /api/v1/node/info

Response: 200 OK
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "NodeInfo",
  "id": "munich.loop",
  "name": "Munich LOOP Node",
  "version": "0.1.0",
  "location": {"lat": 48.1351, "lon": 11.5820},
  "capabilities": ["material-registry", "loopcoin", "loopsignal"],
  "endpoint": "https://munich.loop/api/v1",
  "statistics": {
    "materials_active": 1247,
    "transactions_daily": 89,
    "loopcoin_supply": 450000
  }
}
```

**GET /api/v1/signals**

```http
GET /api/v1/signals

Response: 200 OK
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "LoopSignalConfig",
  "node": "munich.loop",
  "signals": {
    "plastic-pet": 0.30,
    ...
  },
  "valid_from": "2025-06-01T00:00:00Z",
  "valid_until": "2025-06-30T23:59:59Z"
}
```

#### Transactions

**POST /api/v1/transaction**

```http
POST /api/v1/transaction
Content-Type: application/ld+json
Authorization: Bearer {token}

{
  "@context": "https://loop-protocol.org/v1",
  "@type": "MaterialTransaction",
  "id": "TXN-2025-05-27-001",
  "material": "DE-MUC-2025-PLASTIC-B847F3",
  "seller": "munich.loop",
  "buyer": "berlin.loop",
  "offer": {
    "base_price": 120,
    "loop_cost": 156
  },
  "timestamp": "2025-05-27T16:00:00Z"
}

Response: 201 Created
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "TransactionStatus",
  "transaction_id": "TXN-2025-05-27-001",
  "status": "pending",
  "updated_at": "2025-05-27T16:00:00Z",
  "settlement_url": "/api/v1/transaction/TXN-2025-05-27-001"
}
```

### 8.2 Federation Endpoints

For node-to-node communication:

**POST /api/v1/federate/announce**

```http
POST /api/v1/federate/announce
X-Node-Signature: {signature}

{
  "@context": "https://loop-protocol.org/v1",
  "@type": "MaterialAnnouncement",
  "material": "DE-MUC-2025-PLASTIC-B847F3",
  "origin": "munich.loop",
  "available": true
}
```

**POST /api/v1/federate/offer**

```http
POST /api/v1/federate/offer
X-Node-Signature: {signature}

{
  "@context": "https://loop-protocol.org/v1",
  "@type": "MaterialOffer",
  "material": "DE-MUC-2025-PLASTIC-B847F3",
  "from": "berlin.loop",
  "base_price": 120,
  "loop_cost": 156,
  "valid_until": "2025-05-27T18:00:00Z"
}
```

### 8.3 Error Responses

Standard error format:

```json
{
  "error": {
    "code": "MATERIAL_NOT_FOUND",
    "message": "Material with ID DE-MUC-2025-PLASTIC-B847F3 not found",
    "details": {
      "searched_id": "DE-MUC-2025-PLASTIC-B847F3",
      "timestamp": "2025-05-27T15:30:00Z"
    }
  }
}
```

Error codes:

- `INVALID_REQUEST`: Malformed request
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `INTERNAL_ERROR`: Server error

---

## 9. Federation Protocol

### 9.1 Node Discovery

Nodes maintain a registry of peers:

```json
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "NodeRegistry",
  "version": "2025-05-27",
  "nodes": [
    {
      "id": "munich.loop",
      "endpoint": "https://munich.loop/api/v1",
      "public_key": "-----BEGIN PUBLIC KEY-----...",
      "capabilities": ["v0.1", "loopcoin", "loopsignal"],
      "location": {"lat": 48.1351, "lon": 11.5820},
      "status": "active",
      "last_seen": "2025-05-27T15:00:00Z"
    }
  ]
}
```

### 9.2 Node Authentication

Node-to-node requests MUST include:

1. `X-Node-ID`: Requesting node identifier
2. `X-Node-Signature`: Request signature
3. `X-Timestamp`: Request timestamp (±5 minutes tolerance)

### 9.3 Message Propagation

Material announcements follow controlled flooding:

1. Node announces to direct peers
2. Peers forward to their peers (TTL=3)
3. Duplicate detection prevents loops
4. Geographic radius limits propagation

### 9.4 Network Topology

Recommended peering strategy:

- 3-5 nearby nodes (< 200km)
- 2-3 regional nodes (200-1000km)
- 1-2 distant nodes (> 1000km)

---

## 10. Security Considerations

### 10.1 Transport Security

- All connections MUST use TLS 1.3 or higher
- Nodes MUST validate certificates
- Perfect Forward Secrecy REQUIRED

### 10.2 Authentication

- Users authenticate via OAuth 2.0 / OIDC
- Nodes authenticate via mutual TLS or signed requests
- API tokens MUST expire (recommended: 1 hour)

### 10.3 Data Privacy

- Personal data MUST NOT be included in MaterialDNA
- Transaction details are public, user identities are not
- Nodes MUST comply with local privacy laws (GDPR, etc.)

### 10.4 Rate Limiting

Recommended limits:

- User requests: 100/minute
- Node requests: 1000/minute
- Search queries: 10/minute

### 10.5 Audit Trail

Nodes MUST maintain immutable logs of:

- Material registrations
- Transaction settlements
- Signal changes
- Node interactions

---

## 11. Implementation Guidance

### 11.1 Minimum Viable Node

Required components:

1. HTTPS server with valid certificate
2. JSON-LD parser and validator
3. Database for material registry
4. Basic routing calculator
5. Federation client

### 11.2 Technology Recommendations

- **Languages**: JavaScript/Node.js, Python, Go, Rust
- **Databases**: PostgreSQL, MongoDB, SQLite (small nodes)
- **Message Queue**: Redis, RabbitMQ (optional)
- **Caching**: Redis, Memcached (recommended)

### 11.3 Scaling Considerations

- Material registry: Index by category, location, availability
- Federation: Implement connection pooling
- Search: Consider Elasticsearch for large nodes
- Archival: Move expired materials to cold storage

### 11.4 Testing

Test suite MUST cover:

- Protocol compliance
- LoopCost calculations
- Federation connectivity
- Error handling
- Performance benchmarks

---

## 12. Examples

### 12.1 Complete Flow Example

**Step 1: Munich registers spent grain**

```json
POST munich.loop/api/v1/material
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "MaterialDNA",
  "id": "DE-MUC-2025-FOOD-B847F3",
  "category": "organic-food",
  "quantity": {"value": 500, "unit": "kg"},
  "quality": 0.90,
  "location": {
    "lat": 48.1372,
    "lon": 11.5755,
    "address": "Augustiner Brewery"
  },
  "available_from": "2025-05-27T08:00:00Z",
  "expires": "2025-05-30T08:00:00Z"
}

Response:
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "MaterialDNA",
  "id": "DE-MUC-2025-FOOD-B847F3",
  "status": "registered"
}
```

**Step 2: Munich announces to network**

```json
POST vienna.loop/api/v1/federate/announce
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "MaterialAnnouncement",
  "material": "DE-MUC-2025-FOOD-B847F3",
  "origin": "munich.loop",
  "category": "organic-food",
  "quantity": 500,
  "available": true
}
```

**Step 3: Vienna calculates LoopCost**

```
Base offer: 60 LC
Munich export signal (40%): +24 LC
Vienna import signal (20%): +12 LC
Distance (400km × 0.02): +8 LC
Total LoopCost: 104 LC
```

**Step 4: Vienna submits offer**

```json
POST munich.loop/api/v1/federate/offer
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "MaterialOffer",
  "material": "DE-MUC-2025-FOOD-B847F3",
  "from": "vienna.loop",
  "base_price": 60,
  "loop_cost": 104,
  "valid_until": "2025-05-27T18:00:00Z"
}
```

**Step 5: Munich selects local buyer**

```json
{
  "offers": [
    {"from": "munich-farm", "loop_cost": 50},
    {"from": "vienna.loop", "loop_cost": 104},
    {"from": "berlin.loop", "loop_cost": 103}
  ],
  "selected": "munich-farm",
  "reason": "lowest_loop_cost"
}
```

### 12.2 Signal Voting Example

```json
// Proposal
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "SignalProposal",
  "node": "munich.loop",
  "changes": [
    {
      "category": "plastic-pet",
      "current": 0.20,
      "proposed": 0.30,
      "reason": "Increase local plastic recycling"
    }
  ],
  "voting_opens": "2025-06-01T00:00:00Z",
  "voting_closes": "2025-06-07T23:59:59Z"
}

// Vote result
{
  "@context": "https://loop-protocol.org/v1",
  "@type": "LoopVote",
  "node": "munich.loop",
  "vote_id": "2025-06-plastic-increase",
  "proposals": [
    {
      "category": "plastic-pet",
      "current_value": 0.20,
      "proposed_value": 0.30,
      "rationale": "Increase local plastic recycling"
    }
  ],
  "voting_period": {
    "start": "2025-06-01T00:00:00Z",
    "end": "2025-06-07T23:59:59Z"
  },
  "results": {
    "total_eligible": 150000,
    "total_voted": 52500,
    "votes_for": 35700,
    "votes_against": 16800,
    "status": "passed"
  }
}
```

---

## 13. Future Considerations

### 13.1 Planned Features (v0.2)

- Smart contract integration for automated settlement
- Multi-material bundles for efficient trading
- Reputation system for reliable traders
- Advanced routing with machine learning
- Mobile node implementations

### 13.2 Research Areas

- Zero-knowledge proofs for private transactions
- Decentralized identity for users
- Carbon credit integration
- IoT sensor integration
- Cross-chain interoperability

### 13.3 Standardization

Goal: Submit to standards body (W3C, IETF) after v1.0

---

## 14. References

1. Carlsson, R., Nevzorova, T. (2025). "Internet of Materials – A concept for circular material traceability". Cleaner Engineering and Technology, 25, 100911. https://doi.org/10.1016/j.clet.2025.100911
    
2. W3C. (2018). "ActivityPub". W3C Recommendation. https://www.w3.org/TR/activitypub/
    
3. W3C. (2020). "JSON-LD 1.1". W3C Recommendation. https://www.w3.org/TR/json-ld11/
    
4. IETF. (2014). "RFC 7231: Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content". https://tools.ietf.org/html/rfc7231
    
5. IETF. (1997). "RFC 2119: Key words for use in RFCs to Indicate Requirement Levels". https://www.ietf.org/rfc/rfc2119.txt
    
6. Bernstein, D. J. (2006). "Curve25519: new Diffie-Hellman speed records". Public Key Cryptography - PKC 2006. pp. 207–228.
    

---

## Appendix A: JSON-LD Context

```json
{
  "@context": {
    "@version": 1.1,
    "loop": "https://loop-protocol.org/v1/",
    "schema": "https://schema.org/",
    "MaterialDNA": "loop:MaterialDNA",
    "LoopCoin": "loop:LoopCoin",
    "LoopSignal": "loop:LoopSignal",
    "LoopCost": "loop:LoopCost",
    "id": "@id",
    "type": "@type",
    "category": {
      "@id": "loop:category",
      "@type": "@id"
    },
    "quantity": "loop:quantity",
    "value": "schema:value",
    "unit": "schema:unitText",
    "quality": "loop:quality",
    "location": "schema:location",
    "lat": "schema:latitude",
    "lon": "schema:longitude",
    "available_from": {
      "@id": "schema:availabilityStarts",
      "@type": "schema:DateTime"
    },
    "expires": {
      "@id": "schema:availabilityEnds",
      "@type": "schema:DateTime"
    }
  }
}
```

---

## Appendix B: Change Log

### Version 0.1.0 (2025-05-27)

- Initial specification release
- Core protocol definition
- Basic federation support
- Reference calculations

---

_End of Specification_

_This specification is released under Creative Commons BY-SA 4.0 license._  
_Contributions welcome at https://github.com/local-loop-io/loop-protocol_
