# Federation Handshake (Lab Only)

This document defines a **lab-only** handshake payload used to introduce
two LOOP nodes in a controlled demo environment. It does **not** represent
production federation.

## Goals
- Exchange minimal node metadata.
- Confirm protocol version compatibility.
- Establish a lab-only trust acknowledgement.

## Handshake request
Schema: `schemas/handshake.schema.json` (`NodeHandshake`).

Required fields:
- `node_id` (e.g., `munich.loop`)
- `endpoint` (lab API URL)
- `capabilities` (string array)
- `timestamp` (ISO 8601)

## Handshake response
Schema: `schemas/handshake.schema.json` (`NodeHandshakeResponse`).

Required fields:
- `status` (`accepted` or `rejected`)
- `peer_id`
- `received_at`
- `lab_only: true`

## Security notes (lab stage)
- Request signatures are optional placeholders.
- Mutual TLS and request signing are planned for later TRL stages.
