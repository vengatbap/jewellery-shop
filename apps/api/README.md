# API Server

Node.js Express backend implementing modular monolith architecture.

## Quick Start

```bash
# From monorepo root
pnpm dev
```

## Modules

Each module in `src/modules/` follows structure:
- `.routes.ts` — Express routes
- `.controller.ts` — Route handlers
- `.service.ts` — Business logic
- `.repository.ts` — Database queries
- `.validation.ts` — Zod schemas
- `.dto.ts` — Request/response shapes
- `.types.ts` — Internal types
- `.permissions.ts` — RBAC codes
- `.errors.ts` — Error classes
- `index.ts` — Public module interface

## Engines

Business logic engines in `src/engines/`:
- `pricing.engine.ts` — Gold rate, making charge, tax
- `inventory.engine.ts` — Stock calculations
- `accounting.engine.ts` — Journal posting
- `tax.engine.ts` — GST/VAT

## Middleware

- `auth.middleware.ts` — JWT verification
- `tenant.middleware.ts` — organization_id injection
- `branch.middleware.ts` — Branch access validation
- `permission.middleware.ts` — RBAC checks
- `audit.middleware.ts` — Request logging

## Events

Module communication through event bus:
- Emit domain events from services
- Handlers subscribe and react
- Events in `packages/events/`

## Development

```bash
# Watch and reload
pnpm dev

# Type check
pnpm type-check

# Lint
pnpm lint

# Format
pnpm format
```

## Health Check

```bash
curl http://localhost:3000/health
```

Returns:
```json
{
  "success": true,
  "message": "API is healthy",
  "data": { "status": "ok" },
  "meta": { ... }
}
```
