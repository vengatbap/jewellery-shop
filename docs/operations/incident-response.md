# Auric One ERP v1.0 — Incident Response & Triage Protocol

## 1. Severity Classification Matrix

| Severity | Definition & Impact | Response SLA | Resolution SLA |
| :--- | :--- | :---: | :---: |
| **P0 — Critical** | Store offline, database down, POS checkout failing, cross-tenant security breach | **< 15 minutes** | **< 2 hours** |
| **P1 — Major** | Key module degraded (e.g. Resend emails delayed, Gold rate ticker stale) | **< 1 hour** | **< 8 hours** |
| **P2 — Minor** | Non-blocking UI glitch, formatting display issue | **< 24 hours** | Next Patch Release (v1.0.1) |
| **P3 — Enhancement** | Customer feature request | **Backlog** | Prioritized Roadmap |

## 2. Security Breach / Cross-Tenant Violation Response
If a Gate 18 cross-tenant security violation is logged (`SECURITY_VIOLATION_BLOCKED`):
1. **Isolate Token**: Invalidate the actor's session JWT token immediately via `/platform`.
2. **Inspect Audit Log**: Run audit query `SELECT * FROM audit_logs WHERE severity='SECURITY_VIOLATION'`.
3. **Notify Platform Admin**: Alert Security Response Team (`security@auricone.com`).
