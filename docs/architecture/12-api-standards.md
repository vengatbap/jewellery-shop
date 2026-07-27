# 12. API Standards

All services in the Auric One platform must expose clean, uniform REST interfaces matching these conventions.

---

## 1. URL Path Conventions
* **Case Pattern:** Paths are written in lowercase with hyphens (kebab-case).
  * Good: `GET /api/v1/savings-schemes/scheme-accounts`
  * Bad: `GET /api/v1/savings_schemes/schemeAccounts`
* **Resource Pluralization:** Collections are plural nouns.
  * Good: `GET /api/v1/customers`
  * Bad: `GET /api/v1/customer`

---

## 2. Response Envelope Format
Every REST response payload must use a standard JSON envelope:

```json
{
  "success": true,
  "message": "Resource successfully retrieved",
  "data": {
    "id": "6c2fcdb6-4a86-4749-a946-c27c7bc0c1e0",
    "name": "Gold Ring"
  },
  "meta": {
    "requestId": "uuid-v4-log-correlation-id",
    "timestamp": "2026-07-04T16:21:00.000Z",
    "version": "v1"
  }
}
```

---

## 3. Error Response Format
When requests fail, services must return a standard error payload with HTTP status code and array of errors:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "amount must be a positive number",
      "field": "amount"
    }
  ],
  "meta": {
    "requestId": "uuid-v4-log-correlation-id",
    "timestamp": "2026-07-04T16:21:00.000Z",
    "version": "v1"
  }
}
```

---

## 4. Query parameters (Pagination & Filtering)
* **Pagination:** Standardize on offset-based parameters `page` and `limit`.
  * URL: `GET /api/v1/customers?page=1&limit=25`
* **Sorting:** Use `sort` parameter matching fields with sorting direction prefix (`-` for descending).
  * URL: `GET /api/v1/customers?sort=-created_at`
* **Filtering:** Explicit query parameters matched with columns.
  * URL: `GET /api/v1/customers?status=active`

---

## 5. Header Metadata Requirements
Services must process and forward the following headers for every mutating request:
* **`X-Request-ID`**: Correlation UUID created at API Gateway to trace requests across microservice logs.
* **`X-Tenant-ID`**: Enforces strict database data partitioning context.
* **`X-Idempotency-Key`**: Unique string tokens for all write actions (`POST`, `PUT`, `PATCH`). Ensures duplicate request calls within 24 hours do not trigger duplicate database mutations.
