# Security Guide (Node Operators)

This guide summarizes operational security expectations for LOOP nodes.

## Transport security
- Enforce TLS 1.3+ and strong cipher suites.
- Use publicly trusted certificates for production nodes.
- Enable HSTS with a minimum 1-year duration.

## Authentication and authorization
- Use OAuth 2.0 / OIDC for user authentication.
- Require mutual TLS or request signing for node-to-node requests.
- Rotate API tokens and set short expiry times.

## Rate limiting and abuse prevention
- Apply per-user and per-node limits to all endpoints.
- Protect search and federation endpoints from burst traffic.
- Add request replay protection using timestamps and nonces.

## Data protection
- Do not store personal data in MaterialDNA records.
- Encrypt sensitive data at rest and in transit.
- Keep immutable audit logs for registrations and settlements.

## Key management
- Store private keys in HSMs or dedicated secrets managers.
- Rotate keys regularly and revoke compromised keys immediately.

## Monitoring
- Alert on repeated auth failures, unusual traffic, and settlement errors.
- Track certificate expiry and key usage anomalies.

## Backup and recovery
- Encrypt backups and test restores quarterly.
- Keep geographically redundant copies for disaster recovery.
