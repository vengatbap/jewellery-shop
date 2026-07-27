# 08. Platform Roadmap

The 10-phase execution roadmap is structured as follows:

```
┌─────────────────────────────────────────────────────────────┐
│                      PHASE 0: PLATFORM                      │
│  API Gateway, Auth, RBAC, Tenant isolation, Audit logging.   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      PHASE 1: MASTERS                       │
│  Categories, Metals, Purity, Gold Rates, Products,          │
│  Customers, Suppliers.                                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 2: CUSTOMER CRM                    │
│  Customers profiles, Customer Ledger, KYC details.          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               PHASE 3: INVENTORY & STOCK                    │
│  Inventory Items, Barcode tags, Stock movements, Transfers. │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 4: PROCUREMENT                     │
│  Suppliers, Purchase Orders, Goods Receipt.                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      PHASE 5: BILLING                       │
│  Pricing Engine, Invoices, Payments, Gold Exchange.         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     PHASE 6: ACCOUNTING                     │
│  Journals, Ledgers, Financial Reports.                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  PHASE 7: SAVINGS SCHEMES                   │
│  Gold Savings Plans, Installments, Maturity calculations.   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                PHASE 8: REPORTS & ANALYTICS                 │
│  Audits, Ledger Reports, Profitability, Yield, Forecasts.   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     PHASE 9: ADVANCED                       │
│  Repairs, Manufacturing orders, Gold Loan/Pawn module.      │
└─────────────────────────────────────────────────────────────┘
```

Each phase implements the database schemas, API routes, microservices business logic, and UI elements corresponding to its domain. Moving Reports & Analytics to a dedicated phase (Phase 8) ensures a unified view of all platform data after core business services have stabilized.
