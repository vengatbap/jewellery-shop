# 11. Module Registry

This registry serves as the official project tracking board for the implementation of Auric One modules.

## Module Implementation Status

| Phase | Module | Owner | Status | Target Release | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 0** | Platform (Gateway, Auth, RBAC, Tenancy, Logs) | Core | **In Progress** | v1.0.0 | None |
| **Phase 1** | Masters (Products, Categories, Metals, Gold Rates) | Core | **Planned** | v1.1.0 | Platform |
| **Phase 2** | Customer CRM (Profiles, Ledgers, KYC) | Core | **Planned** | v1.1.0 | Platform |
| **Phase 3** | Inventory (Items, Barcodes, Transfers, Stock) | Core | **Planned** | v1.2.0 | Masters |
| **Phase 4** | Procurement (Suppliers, Purchase Orders, Receipts) | Core | **Planned** | v1.2.0 | Inventory, CRM |
| **Phase 5** | Billing (Invoices, Payments, Exchanges) | Core | **Planned** | v1.3.0 | Inventory, CRM |
| **Phase 6** | Accounting (Journals, Ledgers, Accounts) | Core | **Planned** | v1.3.0 | Billing |
| **Phase 7** | Savings Schemes (Gold Savings, Installments, Maturity) | Core | **Planned** | v1.4.0 | Customer CRM, Billing |
| **Phase 8** | Reports & Analytics (Financials, Inventory Audits) | Core | **Planned** | v1.4.0 | All Modules |
| **Phase 9** | Advanced (Repairs, Manufacturing, Pawns) | Core | **Planned** | v1.5.0 | All Modules |
