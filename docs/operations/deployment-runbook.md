# Auric One ERP v1.0 — Deployment & Migration Runbook

## 1. Zero-Downtime Deployment Sequence
```bash
# 1. Pull Latest Release Candidate Branch
git checkout main && git pull origin main

# 2. Run Drizzle Database Migrations
pnpm db:migrate

# 3. Build Production Bundle
pnpm --filter=@auric-one/web build

# 4. Graceful Reload Web Server
pm2 reload auric-one-web
```

## 2. Rollback Playbook
If post-deployment smoke tests detect a P0 critical failure:
```bash
# 1. Rollback Code to Previous Commit Tag
git checkout v1.0.0-RC1

# 2. Rebuild & Reload
pnpm --filter=@auric-one/web build
pm2 reload auric-one-web
```
