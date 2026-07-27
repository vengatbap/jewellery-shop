# 04. Database Schema Ownership

Initially, Auric One uses **one shared PostgreSQL instance** to manage hosting costs and operational simplicity. However, strict database logical schema boundaries are enforced at the service level.

## Schema Partitioning Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Instance                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  inventory  │        │   billing    │        │  accounting  │
│    schema    │        │    schema    │        │    schema    │
│  - items     │        │  - invoices  │        │  - accounts  │
│  - movements │        │  - items     │        │  - journals  │
└──────────────┘        └──────────────┘        └──────────────┘
```

## Governance Constraints

* **Strict Service Ownership:** A service owns its tables completely. Other services must **never** query or execute joins against tables they do not own.
* **REST/Event Ingestion:** If the Billing service needs product parameters, it must execute a REST endpoint query against `inventory-service` instead of reading the product table.
* **Future Migration Pathway:** Because ownership is already logically split by schemas at the code/ORM level, these schemas can be easily migrated to isolated database instances (e.g., Inventory DB, Billing DB) when performance or scaling requirements dictate.
