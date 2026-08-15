# Auric One ERP v1.0 — Pilot Launch Pre-Flight Checklist

## 1. Environment & Infrastructure Pre-Flight

- [x] **Database SSL Mode:** Neon PostgreSQL `DATABASE_URL` configured with `sslmode=require`.
- [x] **Secrets Audit:** `AUTH_SECRET`, `DATABASE_URL`, and `RESEND_API_KEY` isolated to server runtime.
- [x] **Database Backup Test:** PITR WAL archiving active; snapshot restoration verified.
- [x] **Email Deliverability:** Resend TLS dispatch tested for signup verification, password reset, and team invites.
- [x] **Concurrency Locking:** Row-level `SELECT FOR UPDATE` tag locking verified for concurrent POS checkout.

## 2. Gate 18–28 Security & Integrity Pre-Flight

- [x] **Gate 18 Tenant Isolation:** Direct cross-tenant API requests (`org_royalgems` $\rightarrow$ `org_pearlpalace`) return `HTTP 403 Forbidden`.
- [x] **Gate 19 Entitlements:** Unlicensed module API requests (**Starter** requesting **Gold Loans**) return `HTTP 403 Forbidden`.
- [x] **Gate 23 Identity:** Password reset non-enumeration and active session invalidation verified.
- [x] **Gate 24 Team RBAC:** Cashier API mutations to `/api/v1/accounting` or `/api/v1/configuration` blocked with `HTTP 403`.
- [x] **Gate 27 Persistence:** `Create` $\rightarrow$ `Logout` $\rightarrow$ `Login` $\rightarrow$ `GET` verification cycle passed.
- [x] **Production Build:** `pnpm --filter=@auric-one/web typecheck` exited with **0 errors**.
