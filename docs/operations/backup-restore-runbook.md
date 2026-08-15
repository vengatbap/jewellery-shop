# Auric One ERP v1.0 — Backup & Disaster Recovery (PITR) Runbook

## 1. Targets & Metrics
- **Recovery Point Objective (RPO):** $< 5$ minutes (continuous WAL archiving).
- **Recovery Time Objective (RTO):** $< 15$ minutes.

## 2. Automated PostgreSQL Backup Schedule
- Continuous Write-Ahead Log (WAL) archiving to Neon cloud storage.
- Daily full logical backup executed at `02:00 UTC`.

## 3. Point-In-Time Restoration Procedure (PITR)
To restore database to a target timestamp (e.g. `2026-08-14 12:00:00 UTC`):
```bash
# 1. Initiate Neon Point-In-Time Branch Restoration
neon-cli branch create pitr_restore --parent main --timestamp "2026-08-14T12:00:00Z"

# 2. Update Database Connection String
export DATABASE_URL="postgres://user:pass@pitr-endpoint.neon.tech/auricone?sslmode=require"

# 3. Execute Verification & Smoke Tests
pnpm --filter=@auric-one/web typecheck
```
