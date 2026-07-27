"use strict";
/*
├── app.ts
├── config/
│   ├── database.ts
│   ├── env.ts
│   ├── logger.ts
│   └── redis.ts
├── db/
│   ├── index.ts
│   ├── migrations/
│   │   ├── 001_init.sql
│   │   ├── 002_inventory.sql
│   │   └── 003_invoices.sql
│   └── schema/
│       ├── accounting.schema.ts
│       ├── barcode.schema.ts
│       ├── categories.schema.ts
│       ├── customers.schema.ts
│       ├── inventory.schema.ts
│       ├── invoices.schema.ts
│       ├── invoice_items.schema.ts
│       ├── loyalty.schema.ts
│       ├── metals.schema.ts
│       ├── metal_rates.schema.ts
│       ├── notifications.schema.ts
│       ├── organizations.schema.ts
│       ├── pawn.schema.ts
│       ├── payments.schema.ts
│       ├── pricing_rules.schema.ts
│       ├── products.schema.ts
│       ├── roles.schema.ts
│       ├── schemes.schema.ts
│       ├── stock_movements.schema.ts
│       ├── suppliers.schema.ts
│       └── users.schema.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── global.middleware.ts
│   ├── permission.middleware.ts
│   ├── request-id.middleware.ts
│   └── tenant.middleware.ts
├── modules/
│   ├── accounting/
│   │   ├── accounting.controller.ts
│   │   ├── accounting.repository.ts
│   │   ├── accounting.routes.ts
│   │   └── accounting.service.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   └── auth.validation.ts
│   ├── barcode/
│   │   ├── barcode.controller.ts
│   │   ├── barcode.generator.ts
│   │   ├── barcode.repository.ts
│   │   ├── barcode.routes.ts
│   │   └── barcode.service.ts
│   ├── customers/
│   │   ├── customers.controller.ts
│   │   ├── customers.repository.ts
│   │   ├── customers.routes.ts
│   │   ├── customers.service.ts
│   │   └── customers.validation.ts
│   ├── gold-rate/
│   │   ├── gold-rate.controller.ts
│   │   ├── gold-rate.repository.ts
│   │   ├── gold-rate.routes.ts
│   │   └── gold-rate.service.ts
│   ├── inventory/
│   │   ├── inventory.controller.ts
│   │   ├── inventory.repository.ts
│   │   ├── inventory.routes.ts
│   │   ├── inventory.service.ts
│   │   └── inventory.validation.ts
│   ├── invoices/
│   │   ├── invoices.controller.ts
│   │   ├── invoices.repository.ts
│   │   ├── invoices.routes.ts
│   │   └── invoices.service.ts
│   ├── loyalty/
│   │   ├── loyalty.controller.ts
│   │   ├── loyalty.repository.ts
│   │   ├── loyalty.routes.ts
│   │   └── loyalty.service.ts
│   ├── manufacturing/
│   │   ├── manufacturing.controller.ts
│   │   ├── manufacturing.repository.ts
│   │   ├── manufacturing.routes.ts
│   │   └── manufacturing.service.ts
│   ├── notifications/
│   │   ├── notifications.controller.ts
│   │   ├── notifications.repository.ts
│   │   ├── notifications.routes.ts
│   │   └── notifications.service.ts
│   ├── organizations/
│   │   ├── organization.controller.ts
│   │   ├── organization.repository.ts
│   │   ├── organization.routes.ts
│   │   └── organization.service.ts
│   ├── pawn/
│   │   ├── pawn.controller.ts
│   │   ├── pawn.repository.ts
│   │   ├── pawn.routes.ts
│   │   └── pawn.service.ts
│   ├── payments/
│   │   ├── payments.controller.ts
│   │   ├── payments.repository.ts
│   │   ├── payments.routes.ts
│   │   └── payments.service.ts
│   ├── pos/
│   │   ├── engines/
│   │   │   ├── invoice.engine.ts
│   │   │   ├── pricing.engine.ts
│   │   │   └── stock.engine.ts
│   │   ├── pos.controller.ts
│   │   ├── pos.repository.ts
│   │   ├── pos.routes.ts
...
│   │   ├── users.service.ts
│   │   └── users.validation.ts
├── server.ts
├── services/
│   ├── barcode.service.ts
│   ├── gold-rate.service.ts
│   ├── invoice.service.ts
│   └── pricing.service.ts
├── tsconfig.json
├── utils/
│   ├── api-response.ts
│   ├── app-error.ts
│   ├── currency.ts
│   ├── date.ts
│   ├── pagination.ts
│   └── uuid.ts
└── workers/
    ├── gold-rate-sync.worker.ts
    ├── invoice-cleanup.worker.ts
    ├── scheme-reminder.worker.ts
    └── stock-reconciliation.worker.ts
*/
