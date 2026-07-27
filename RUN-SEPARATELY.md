# RUN SEPARATELY - API & Frontend Setup Guide

## 📁 Project Structure Consolidation

The Jewellery ERP project is now a **unified monorepo** with separate, independently runnable applications:

```
jewellery-shop/ (MAIN MONOREPO)
├── apps/
│   ├── api/                    ← BACKEND (Express) - Runs Separately
│   └── web/                    ← FRONTEND (Next.js) - Runs Separately
├── packages/                   ← Shared infrastructure
├── package.json                ← Root monorepo config
└── .env.local                  ← Single environment config
```

### Removed Old Directories (No Longer Needed)
- ❌ `backend/` — Use `apps/api/` instead
- ❌ `frontend/` — Use `apps/web/` instead  
- ❌ `jewellery-backend-v2/` — Replaced by new architecture

---

## 🚀 Running API & Frontend Separately

### 1️⃣ Initial Setup (One Time)

```powershell
# Navigate to project
cd D:\jewellery-shop

# Install all dependencies
pnpm install

# Copy environment template
Copy-Item .env.example .env.local

# Edit .env.local with your settings
notepad .env.local
```

**Required in `.env.local`:**
```env
DATABASE_URL=postgresql://localhost:5432/jewellery_erp
JWT_SECRET=your-secret-key-min-32-characters
API_PORT=3000
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 2️⃣ Database Setup (One Time)

```powershell
# Generate migrations from schemas
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed default organization + roles
pnpm db:seed

# Verify connection
curl http://localhost:3000/health
```

### 3️⃣ Run API in Terminal 1

```powershell
# Terminal 1 - BACKEND API
cd D:\jewellery-shop
pnpm dev:api
```

**Output should show:**
```
🚀 API server running at http://localhost:3000
📝 Environment: development
```

**Verify API is working:**
```powershell
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is healthy",
  "data": { "status": "ok" },
  "meta": { "requestId": "...", "timestamp": "...", "version": "v1" }
}
```

### 4️⃣ Run Frontend in Terminal 2

```powershell
# Terminal 2 - FRONTEND (NEW TERMINAL)
cd D:\jewellery-shop
pnpm dev:web
```

**Output should show:**
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Environment:  development
```

**Frontend runs on:** `http://localhost:3000`

---

## 🎯 ALL Run Commands

### Run Everything Together
```powershell
pnpm dev
```
Starts both API + Frontend in parallel.

### Run API Only
```powershell
pnpm dev:api
# Runs on http://localhost:3000
```

### Run Frontend Only
```powershell
pnpm dev:web
# Runs on http://localhost:3000
```

### Production Builds

**Build all:**
```powershell
pnpm build
```

**Build API only:**
```powershell
pnpm build:api
# Output: apps/api/dist/
```

**Build Frontend only:**
```powershell
pnpm build:web
# Output: apps/web/.next/
```

### Start Production Servers

**Start API (after build):**
```powershell
pnpm start:api
# Runs on configured API_PORT (default 3000)
```

**Start Frontend (after build):**
```powershell
pnpm start:web
# Runs on port 3000
```

### Code Quality

```powershell
pnpm lint          # Lint all packages
pnpm format        # Format all code
pnpm type-check    # Type check all
pnpm clean         # Clean caches and node_modules
```

---

## 📋 Complete Setup Checklist

- [ ] Node.js 20+ installed
- [ ] pnpm 8+ installed
- [ ] PostgreSQL running (or Neon account)
- [ ] Cloned repository
- [ ] `pnpm install` completed
- [ ] `.env.local` created and configured
- [ ] `pnpm db:migrate` completed
- [ ] `pnpm db:seed` completed
- [ ] API health check passing (`curl http://localhost:3000/health`)
- [ ] API runs with `pnpm dev:api`
- [ ] Frontend runs with `pnpm dev:web`

---

## 🔧 Port Configuration

Default ports can be changed in `.env.local`:

```env
# Change API port (default 3000)
API_PORT=3001

# Frontend uses next.config.js or command line override
```

If API port changed to 3001, update frontend:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## 🐛 Troubleshooting

### Issue: `pnpm install` fails

**Solution:**
```powershell
# Clear pnpm cache
pnpm store prune

# Remove lock files
Remove-Item pnpm-lock.yaml
Remove-Item -Recurse node_modules

# Reinstall
pnpm install
```

### Issue: Port 3000 already in use

**Solution:**
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Or change API_PORT in .env.local
API_PORT=3001
```

### Issue: Database connection error

**Verify connection string:**
```powershell
# Test with psql
psql -h localhost -p 5432 -U postgres -d jewellery_erp
```

**Or update `.env.local`:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/jewellery_erp
```

### Issue: Next.js build errors

```powershell
# Clear Next.js cache
Remove-Item -Recurse apps/web/.next

# Rebuild
pnpm build:web
```

### Issue: TypeScript errors

```powershell
# Run type check
pnpm type-check

# Generate types for Next.js
pnpm --filter=@jewellery-erp/web run build
```

---

## 📚 Directory Guide

| Path | Purpose | Runs Separately? |
|------|---------|------------------|
| `apps/api/` | Express backend | ✅ Yes - `pnpm dev:api` |
| `apps/web/` | Next.js frontend | ✅ Yes - `pnpm dev:web` |
| `packages/database/` | Drizzle ORM layer | ❌ No (shared) |
| `packages/shared/` | Types/enums | ❌ No (shared) |
| `packages/config/` | Env validation | ❌ No (shared) |
| `packages/events/` | Event bus | ❌ No (shared) |
| `packages/validation/` | Zod schemas | ❌ No (shared) |
| `packages/workflows/` | Orchestration | ❌ No (shared) |

---

## 🔄 Development Workflow

### Scenario 1: Work on API Only
```powershell
# Terminal 1
pnpm dev:api

# Make changes in apps/api/src/
# Hot reload works automatically
```

### Scenario 2: Work on Frontend Only
```powershell
# Terminal 1
pnpm dev:web

# Make changes in apps/web/src/
# Hot reload works automatically
```

### Scenario 3: Work on Both (Recommended)
```powershell
# Terminal 1
pnpm dev:api

# Terminal 2
pnpm dev:web

# Make changes in either app
# Both hot reload independently
```

### Scenario 4: Work on Shared Packages
```powershell
# Terminal 1 - API watching changes
pnpm dev:api

# Terminal 2 - Frontend watching changes  
pnpm dev:web

# Edit files in packages/*
# Changes auto-reload in both api and web
```

---

## 📊 Request Flow

```
Frontend (Next.js on 3000) 
    ↓ HTTP Request
    │ POST /api/v1/auth/login
    │
API (Express on 3000 - via NEXT_PUBLIC_API_URL)
    ↓ Validates + Processes
    │ ├─ Auth middleware
    │ ├─ RBAC middleware  
    │ ├─ Service logic
    │ └─ Database query
PostgreSQL
    ↓ Response
    │
Frontend (Display result)
```

---

## ✅ Health Indicators

| Check | Command | Expected |
|-------|---------|----------|
| API Health | `curl http://localhost:3000/health` | `{"success": true, ...}` |
| Frontend Load | Visit `http://localhost:3000` | Landing page displays |
| Database | `psql postgresql://localhost/jewellery_erp` | Connect succeeds |
| Types | `pnpm type-check` | No errors |
| Lint | `pnpm lint` | No errors |

---

## 🚀 Next Phase: Implementation

After setup verification, implement Phase 0 components:

- **0.4 Auth Module** — Register, login, JWT
- **0.5 RBAC** — Permissions, role assignment  
- **0.6 Organizations** — CRUD, onboarding
- **0.7 Branches** — CRUD, user access
- **0.8 Settings** — Key-value storage
- **0.9 Audit** — Auto-logging
- **0.10 Files** — Upload/download
- **0.11 Notifications** — In-app service

---

## 📞 Support

See also:
- [QUICKSTART.md](./QUICKSTART.md) — Quick setup
- [ARCHITECTURE.md](./ARCHITECTURE.md) — System architecture
- [ARCHITECTURE-v1.0-FROZEN.md](../cmms/ARCHITECTURE-v1.0-FROZEN.md) — Detailed spec
- [apps/api/README.md](./apps/api/README.md) — API dev guide
- [apps/web/README.md](./apps/web/README.md) — Frontend dev guide

---

## 💡 Tips

**Tip 1:** Always run `pnpm install` after pulling changes with new dependencies

**Tip 2:** Use separate terminals for API + Frontend for faster iteration

**Tip 3:** Monitor logs: API logs to console, Frontend shows build warnings

**Tip 4:** TypeScript errors show in terminal immediately - fix them before continuing

**Tip 5:** Database migrations run automatically on app start (in Phase 0.2 database package migration runner)
