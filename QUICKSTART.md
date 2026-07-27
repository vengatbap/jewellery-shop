# Quick Start Guide

## Prerequisites

- **Node.js 20+** ([Download](https://nodejs.org))
- **pnpm 8+** (`npm install -g pnpm`)
- **PostgreSQL 15+** (local or cloud via Neon)

## Installation

```bash
# Clone and enter project
cd d:\jewellery-shop

# Install all dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Update .env.local with your settings:
# - DATABASE_URL=postgresql://user:password@localhost:5432/jewellery_erp
# - JWT_SECRET=your-secret-32-chars-minimum
# - API_PORT=3000
# - NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Development Mode

### Option 1: Run Everything Together (Recommended for Development)

```bash
pnpm dev
```

This starts:
- **API** on `http://localhost:3000`
- **Frontend** on `http://localhost:3001` (if configured)

### Option 2: Run API Only

```bash
pnpm dev:api
```

- API runs on `http://localhost:3000`
- Health endpoint: `http://localhost:3000/health`

### Option 3: Run Frontend Only

```bash
pnpm dev:web
```

- Frontend runs on `http://localhost:3000`

### Option 4: Run Each Separately in Different Terminals

**Terminal 1 - API:**
```bash
pnpm dev:api
```

**Terminal 2 - Frontend (in another terminal):**
```bash
pnpm dev:web
```

## Database Setup

### First Time Only

```bash
# Generate migrations from schemas
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed default data (organization, roles)
pnpm db:seed
```

### Verify Database Connection

After setup, verify health endpoint:
```bash
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

## Production Build & Start

### Build Everything

```bash
pnpm build
```

### Start API

```bash
pnpm start:api
```

API runs on configured `API_PORT` (default 3000)

### Start Frontend

```bash
pnpm start:web
```

Frontend runs on port 3000

### Build API Only

```bash
pnpm build:api
```

Output in `apps/api/dist/`

### Build Frontend Only

```bash
pnpm build:web
```

Output in `apps/web/.next/`

## Code Quality

### Lint All

```bash
pnpm lint
```

### Format All

```bash
pnpm format
```

### Type Check All

```bash
pnpm type-check
```

### Clean Build Cache

```bash
pnpm clean
```

Removes all node_modules, dist, .next directories and Turbo cache.

## Project Structure

```
jewellery-shop/
├── apps/
│   ├── api/                    # Express backend (runs separately)
│   │   ├── package.json
│   │   ├── src/server.ts       # Start point
│   │   └── src/app.ts          # Express app
│   └── web/                    # Next.js frontend (runs separately)
│       ├── package.json
│       ├── next.config.js
│       └── src/app/            # App Router pages
│
├── packages/
│   ├── database/               # Drizzle ORM + schemas
│   ├── shared/                 # Types, enums, constants
│   ├── config/                 # Env validation, permissions
│   ├── events/                 # Event bus
│   ├── validation/             # Zod schemas
│   └── workflows/              # Workflow orchestration
│
├── package.json                # Root monorepo config
├── tsconfig.json               # Base TypeScript config
├── turbo.json                  # Build pipeline
├── pnpm-workspace.yaml         # pnpm workspaces
└── .env.example                # Environment template
```

## Troubleshooting

### pnpm install fails

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Port already in use

Change in `.env.local`:
```
API_PORT=3001        # Instead of 3000
```

### Database connection error

Verify in `.env.local`:
```
DATABASE_URL=postgresql://localhost:5432/jewellery_erp
```

Test connection:
```bash
psql postgresql://localhost:5432/jewellery_erp
```

### Next.js build fails

```bash
# Clear Next.js cache
rm -rf apps/web/.next

# Rebuild
pnpm build:web
```

## Environment Variables Explained

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | Yes | `postgresql://localhost:5432/jewellery_erp` | PostgreSQL connection |
| `JWT_SECRET` | Yes | 32+ char random string | Auth token signing |
| `API_PORT` | No | `3000` | API server port |
| `NODE_ENV` | No | `development` | Environment |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:3000/api/v1` | Frontend API endpoint |
| `LOG_LEVEL` | No | `info` | Logging level |

## Testing API Endpoints

### Health Check

```bash
curl http://localhost:3000/health
```

### With Request ID

```bash
curl -H "X-Request-ID: test-123" http://localhost:3000/health
```

## Common Commands Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Run all services |
| `pnpm dev:api` | Run API only |
| `pnpm dev:web` | Run frontend only |
| `pnpm build` | Build all |
| `pnpm build:api` | Build API |
| `pnpm build:web` | Build frontend |
| `pnpm start:api` | Start API prod |
| `pnpm start:web` | Start frontend prod |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:seed` | Seed database |
| `pnpm db:generate` | Generate migrations |
| `pnpm lint` | Lint all code |
| `pnpm format` | Format all code |
| `pnpm type-check` | Type check all |
| `pnpm clean` | Clean build caches |

## Next Steps

1. ✅ Install dependencies: `pnpm install`
2. ✅ Setup database: `pnpm db:migrate && pnpm db:seed`
3. ✅ Run development: `pnpm dev` or `pnpm dev:api`
4. ✅ Verify health: `curl http://localhost:3000/health`
5. 🔜 Implement Phase 0 modules (auth, RBAC, organizations, etc.)

## Support

See:
- [README.md](./README.md) - Architecture overview
- [ARCHITECTURE-v1.0-FROZEN.md](../cmms/ARCHITECTURE-v1.0-FROZEN.md) - Frozen architecture spec
- [apps/api/README.md](./apps/api/README.md) - API development guide
- [apps/web/README.md](./apps/web/README.md) - Frontend development guide
- [PHASE-0-SETUP-COMPLETE.md](./PHASE-0-SETUP-COMPLETE.md) - Setup details
