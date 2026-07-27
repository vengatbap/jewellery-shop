# 02. System Overview

Auric One is structured as a **Modular Monolith / Microservices Workspace** utilizing a monorepo workspace engine (pnpm workspaces + Turborepo).

## System Context Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    AURIC ONE MONOREPO                       │
└─────────────────────────────────────────────────────────────┘
                               │
                 ┌──────────────┼──────────────┐
                 │              │              │
           ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼──────┐
           │  apps/api │  │ apps/web  │  │ packages/ │
           │ (Gateway) │  │ (Next.js) │  │(shared)   │
           └───────────┘  └───────────┘  └───────────┘
```

## Monorepo Top-Level Structure
* **`apps/`**: Houses independent, deployable services and user interfaces.
* **`packages/`**: Houses shared infrastructure libraries (Database connections, Event Bus, validation schemas, workflows) imported across the applications.
* **`infrastructure/`**: Deployment, environment, and container setups.
* **`docs/`**: Official architectural, API, and project documentation.
