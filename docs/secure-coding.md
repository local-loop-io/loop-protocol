# Secure Coding Practices

## Input validation
- Validate all incoming payloads against JSON schemas.
- Reject unknown fields that are not part of the schema or contract.
- Normalize and sanitize user-provided strings.

## Output encoding
- Return JSON only and set explicit `Content-Type` headers.
- Avoid reflecting untrusted input in error messages.

## Authentication and authorization
- Enforce least privilege for all API tokens.
- Use scoped tokens for administrative and node-to-node actions.

## Secrets management
- Never store secrets in source control.
- Load secrets from environment variables or a secrets manager.

## Cryptography
- Use well-tested libraries for Ed25519 and hashing.
- Use CSPRNGs for all key and token generation.

## Dependency hygiene
- Pin dependency versions and monitor for CVEs.
- Run automated dependency audits before releases.

## Logging
- Log security-relevant events (auth failures, invalid payloads).
- Redact sensitive data in logs.
