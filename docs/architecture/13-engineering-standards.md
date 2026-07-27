# 13. Engineering & Coding Standards

This document establishes the code quality, architectural layout, and development guidelines for Auric One services.

---

## 1. Directory Structure inside apps/*
Every backend microservice must follow this layout format:
```
apps/[service-name]/
├── src/
│   ├── server.ts         # Server entry point
│   ├── app.ts            # Express application bootstrap
│   ├── middleware/       # Service-specific middlewares
│   ├── modules/          # Domain folders
│   │   └── [domain]/     # Feature domain folder
│   │       ├── routes.ts
│   │       ├── controller.ts
│   │       ├── service.ts
│   │       ├── repository.ts
│   │       └── validation.ts
│   └── utils/            # Shared utilities
├── tsconfig.json
└── package.json
```

---

## 2. Layer Definitions

### 2.1. Routing & Controllers
* **Responsibility:** Ingest incoming request data, validate body payload using Zod validation files, check permission levels, and invoke services.
* **Rule:** Controllers must **never** make direct SQL queries. They only handle HTTP inputs/outputs and forward processing to the service layer.

### 2.2. Service Layer
* **Responsibility:** Orchestrate business rules and process flow. Services communicate with internal repositories or call foreign microservice APIs.
* **Rule:** Services must remain decoupled from Express requests/responses (`req`, `res` parameters). They receive primitives, objects, or DTO contracts.

### 2.3. Repository Layer
* **Responsibility:** Execute SQL queries against Drizzle schemas.
* **Rule:** Repositories only query tables owned by their domain context. They must never cross-query tables belonging to another schema.

---

## 3. Data Transfer Objects (DTOs)
* Every API contract must define a matching DTO inside `@jewellery-erp/contracts` (e.g. `InventoryItemDTO`, `CustomerDTO`).
* DTOs decouple service internal records from public payloads. Services translate internal models to DTO structures before returning response messages.

---

## 4. Structured Logging Rules
* Services must not use raw `console.log`. They must use the pino logger defined in `@jewellery-erp/core`.
* Every log line must include:
  * `requestId`: The request correlation ID.
  * `tenantId`: The current tenant ID context.
  * `timestamp`: Standard UTC ISO string.
