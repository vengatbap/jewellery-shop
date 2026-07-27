# 06. Event & Integration Architecture

This section covers microservice integration, API interfaces, transaction logic, and idempotency guarantees.

## 1. Integrations & Path Versioning
All REST endpoints exposed by microservices must include a major version prefix:
* `/api/v1/inventory/*`
* `/api/v1/billing/*`

If breaking structural updates are introduced to a contract, a new `/api/v2/*` path must be exposed and run in parallel.

## 2. Request Traceability Headers
Every HTTP call traversing the Auric One architecture must propagate these headers:
```http
X-Request-ID: <uuid-v4>
X-Tenant-ID: <uuid-v4>
X-User-ID: <uuid-v4>
X-Branch-ID: <uuid-v4>
```

## 3. Transaction Strategy
Auric One does not support distributed database transactions or two-phase commits (2PC) across microservice boundaries. Consistency is maintained via:
* **Compensating Transactions:** If an action fails midway through a workflow, the orchestrator triggers a compensating event to revert changes.
* **Automated Retries:** Network and lock failures trigger retry rules with exponential backoff.
* **Synchronous Events:** Domain events are generated synchronously today via HTTP callbacks and will migrate to message brokers (e.g., Redis Streams / Kafka) when scale demands it.

## 4. Idempotency Keys
To prevent duplicate state mutation, all mutating endpoints (`POST`, `PUT`, `PATCH`) must support:
```http
X-Idempotency-Key: <unique-token>
```
* **Store & Match:** The receiving service stores the key in a fast Redis cache with a 24-hour expiration.
* **Collision Handling:** If a duplicate key is detected, the service returns the cached response of the initial request instead of re-executing.

## 5. Health Endpoints
Every microservice must expose three endpoint paths under the root URL:
1. `GET /health`: Fast health check returns `200 OK` if the process is alive.
2. `GET /ready`: Health check returns `200 OK` only if connection pools (Database, Redis, etc.) are successfully connected.
3. `GET /version`: Returns current software release metadata (git hash, tag, timestamp).
