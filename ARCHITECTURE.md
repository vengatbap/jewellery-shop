# Jewellery ERP Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    JEWELLERY ERP MONOREPO                   │
└─────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
          ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼──────┐
          │  apps/api │  │ apps/web  │  │ packages/ │
          │ (Express) │  │ (Next.js) │  │(shared)   │
          └─────┬─────┘  └─────┬─────┘  └────┬──────┘
                │              │              │
    ┌───────────┴──────────────┴──────────────┴───────────┐
    │                                                      │
    ├─ database (Drizzle ORM + PostgreSQL)               │
    ├─ shared (types, enums, constants)                  │
    ├─ config (env validation, permissions)             │
    ├─ events (event bus, domain events)                │
    ├─ validation (Zod schemas)                         │
    └─ workflows (orchestration)                        │
    
    ┌──────────────────────────────────────────────────┐
    │         PostgreSQL Database (Single)             │
    │                                                   │
    │  ├─ organizations (multi-tenant)                │
    │  ├─ branches                                    │
    │  ├─ users, roles, permissions                 │
    │  ├─ audit_logs (append-only)                  │
    │  └─ [Phase 1+: customers, products, etc.]    │
    └──────────────────────────────────────────────────┘
```

## 🚀 Quick Start Options

### All in One (Development)
```bash
pnpm dev
# Starts API + Frontend together
```

### API Only
```bash
pnpm dev:api
# http://localhost:3000
```

### Frontend Only
```bash
pnpm dev:web
# http://localhost:3000 (different port)
```

### Separate Terminals
```bash
# Terminal 1
pnpm dev:api

# Terminal 2
pnpm dev:web
```

## 📦 Core Packages

| Package | Purpose | Location |
|---------|---------|----------|
| `@jewellery-erp/database` | Drizzle ORM + PostgreSQL schemas | `packages/database/` |
| `@jewellery-erp/shared` | Types, enums, constants | `packages/shared/` |
| `@jewellery-erp/config` | Env validation, permissions registry | `packages/config/` |
| `@jewellery-erp/events` | Event bus for module communication | `packages/events/` |
| `@jewellery-erp/validation` | Zod input validation schemas | `packages/validation/` |
| `@jewellery-erp/workflows` | Workflow orchestration | `packages/workflows/` |

## 🎯 Apps

### API (`apps/api`)

**Technology:** Express + Node.js  
**Type:** TypeScript  
**Port:** 3000 (default)  
**Runs:** Independently or with monorepo  

**Start:**
```bash
pnpm dev:api          # Development
pnpm build:api        # Production build
pnpm start:api        # Start built app
```

**Structure:**
```
apps/api/
├── src/
│   ├── server.ts          # Entry point
│   ├── app.ts             # Express setup
│   ├── middleware/        # Middleware stack
│   ├── modules/           # Feature modules
│   ├── engines/           # Business engines
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

### Frontend (`apps/web`)

**Technology:** Next.js 14 (App Router) + React  
**Type:** TypeScript  
**Port:** 3000 (default)  
**Runs:** Independently or with monorepo  

**Start:**
```bash
pnpm dev:web          # Development
pnpm build:web        # Production build
pnpm start:web        # Start built app
```

**Structure:**
```
apps/web/
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks
│   └── services/          # API client
├── package.json           # Dependencies
├── next.config.js         # Next.js config
└── tsconfig.json          # TypeScript config
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                    │
│  - React components with Tailwind CSS                  │
│  - shadcn/ui components                                │
│  - React Hook Form for forms                           │
│  - TanStack Query for data fetching                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                ┌──────▼────────┐
                │  HTTP/REST    │
                │  /api/v1/*    │
                └──────┬────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│               Backend (Express API)                     │
│  - Request ID middleware                               │
│  - Auth/RBAC middleware                                │
│  - Module controllers/services                         │
│  - Business engines                                    │
│  - Event emission                                      │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    ┌───▼───┐  ┌───────▼────┐  ┌─────▼──────┐
    │Events │  │Validation  │  │ Shared     │
    │Bus    │  │(Zod)       │  │ Types/Env  │
    └───────┘  └────────────┘  └────────────┘
        │
    ┌───▼────────────────────────────────┐
    │   PostgreSQL Database              │
    │   (Single source of truth)         │
    │   Multi-tenant, soft-delete        │
    └────────────────────────────────────┘
```

## 🔐 Multi-Tenant Design

Every business table includes:

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  business_id VARCHAR(20) UNIQUE,  -- ORG-00001
  organization_id UUID NOT NULL,   -- For consistency
  name VARCHAR(255),
  -- ...
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ           -- Soft delete
);

CREATE TABLE branches (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,   -- FK to organizations
  -- ...
  FOREIGN KEY(organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- All queries: SELECT * FROM table WHERE organization_id = ? AND deleted_at IS NULL
```

## 🧩 Module Architecture

Each module follows pattern:

```
modules/
├── auth/
│   ├── auth.routes.ts           -- Express routes
│   ├── auth.controller.ts        -- Route handlers
│   ├── auth.service.ts           -- Business logic
│   ├── auth.repository.ts        -- DB queries
│   ├── auth.validation.ts        -- Zod schemas
│   ├── auth.dto.ts               -- Request/response shapes
│   ├── auth.types.ts             -- Internal types
│   ├── auth.permissions.ts       -- RBAC codes
│   ├── auth.errors.ts            -- Error classes
│   └── index.ts                  -- Public interface
│
├── organizations/
│   ├── organizations.routes.ts
│   ├── organizations.service.ts
│   └── ...
│
└── [other modules...]
```

**Module exports only:** Service interfaces, not repositories.  
**Communication:** Via events, not direct calls.

## 🚦 Deployment

### Development Environment
```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

### Production Build & Run

**API:**
```bash
pnpm build:api
pnpm start:api              # Runs on API_PORT (default 3000)
```

**Frontend:**
```bash
pnpm build:web
pnpm start:web              # Runs on port 3000
```

**With Docker (future):**
```bash
docker-compose up           # Both services + PostgreSQL
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | Setup & run instructions |
| [ARCHITECTURE-v1.0-FROZEN.md](../cmms/ARCHITECTURE-v1.0-FROZEN.md) | Complete architecture spec |
| [PHASE-0-SETUP-COMPLETE.md](./PHASE-0-SETUP-COMPLETE.md) | Infrastructure setup details |
| [apps/api/README.md](./apps/api/README.md) | API development guide |
| [apps/web/README.md](./apps/web/README.md) | Frontend development guide |

## 🛠️ Tech Stack

### Backend
- **Node.js 20+** — Runtime
- **Express** — HTTP framework
- **TypeScript** — Type safety
- **Drizzle ORM** — Database layer
- **PostgreSQL** — Database
- **Zod** — Input validation
- **JWT** — Authentication

### Frontend  
- **Next.js 14** — React framework
- **React 18** — UI library
- **Tailwind CSS** — Styling
- **shadcn/ui** — Components
- **React Hook Form** — Form management
- **TanStack Query** — Data fetching
- **Axios** — HTTP client

### Monorepo
- **Turborepo** — Build system
- **pnpm** — Package manager
- **ESLint** — Linting
- **Prettier** — Formatting

## ✅ Ready to Start?

1. **Setup:**
   ```bash
   pnpm install
   cp .env.example .env.local
   # Update .env.local with your database URL
   ```

2. **Database:**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

3. **Develop:**
   ```bash
   pnpm dev              # All services
   # OR
   pnpm dev:api         # API only
   pnpm dev:web         # Frontend only
   ```

4. **Verify:**
   ```bash
   curl http://localhost:3000/health
   ```

See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions.
