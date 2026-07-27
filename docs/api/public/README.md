# Auric One Public Integration APIs

This directory houses the specifications for public APIs exposed to third-party developers and external integrations (e.g. e-commerce synchronizers, custom accounting bridges, or messaging bots).

## Public API Policy
To preserve the internal security and stability of the platform, the following constraints apply to all public contracts:

1. **Authentication:** Third-party callers must authenticate using scoped **API Tokens** (JWTs generated with restricted tenant scopes) rather than standard user-session credentials.
2. **Rate Limiting:** Public endpoints enforce strict hourly rate limits (e.g., maximum 1,000 requests per hour per tenant) controlled at the Gateway level (`apps/api`).
3. **Data Access Layer:** Public API controllers call internal microservices via REST API calls. Under no circumstances may public gateways access microservice databases directly.
4. **Contract Stability:** Public endpoint structures must remain backward compatible. Any breaking modifications will trigger a minor or major API path version increment (e.g., `/api/public/v2/...`).
