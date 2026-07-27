# 03. Service Boundaries

Ownership of data models and modules is strictly divided to ensure clean separation of concerns and avoid the creation of a "god service."

## Service Responsibilities Matrix

| Service | Primary Responsibility (Owns) | Secondary Responsibility (Owns) | Never Owns |
| :--- | :--- | :--- | :--- |
| **`inventory-service`** | Products, Inventory Items, Stock | Barcodes, Stock Movements | Invoices, Payments, Customer data |
| **`billing-service`** | Invoices, Payments | Tax calculations, Receipt layout | Product weight, Stock quantities |
| **`accounting-service`** | Journal Entries, Ledger Accounts | Financial Reports, Audits | Customer information, live rates |
| **`customer-service`** | Customers, KYC Profiles | Loyalty Points, Customer Ledgers | Invoices, Inventory items |
| **`procurement-service`** | Suppliers, Purchase Orders | Goods Receipts | Invoices, Customer ledger |
| **`gold-rate-service`** | Live Gold Rates, Rate History | Purity Matrix | Warehouse stock, Invoices |
| **`savings-scheme-service`** | Schemes, Scheme Accounts | Installments, Bonus Rules | Invoice details, Warehouse stock |
| **`api` (Gateway)** | Tenant verification, Routing, Auth | Rate limiting, Request logging | Core business rules, tables |
