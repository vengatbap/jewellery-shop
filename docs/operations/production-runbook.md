# Auric One ERP v1.0 — Production Operations Runbook

## 1. System Overview & Architecture
Auric One is a multi-tenant enterprise SaaS ERP tailored for jewellery retailers, refineries, and pawn loan institutions.

```text
CLIENT (Browser) ──► NEXT.JS Dev/Prod (Port 3030/443) ──► POSTGRESQL (DB Pool) ──► RESEND (TLS Email)
```

## 2. Environment Variables & Secret Auditing
The following environment variables must be defined in the production runtime environment (`.env.production`). **NEVER commit raw secrets to source control.**

| Secret Key | Description | Storage Scope |
| :--- | :--- | :---: |
| `DATABASE_URL` | Neon PostgreSQL Connection String (SSL mode required) | Server Only |
| `AUTH_SECRET` | Auth.js / NextAuth Session Signing Key | Server Only |
| `RESEND_API_KEY` | Resend API Key for Email Dispatch | Server Only |
| `NEXT_PUBLIC_API_URL` | Application API Base Endpoint | Client & Server |

## 3. Server Startup & Service Health Checks
To start the production server:
```bash
pnpm --filter=@auric-one/web build
pnpm --filter=@auric-one/web start -p 3030
```

Verify service health probe:
```bash
curl -i http://localhost:3030/api/health
```
Expected Output: `HTTP 200 OK` with JSON payload `{ "status": "UP", "database": "HEALTHY", "latencyMs": 2.1 }`.
