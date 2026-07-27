# Auric One Product Editions & Licensing

This document maps the business features, application access controls, and module packaging for different commercial editions of the platform.

---

## 1. Community Edition
Targeted at small, single-store jewellery retailers requiring basic billing capabilities.
* **Included Modules:**
  * **Masters:** Categories, products, purities, and metal rate logs.
  * **Billing:** Simple POS invoicing, basic receipts, and payment logs.
* **Limitations:**
  * Single branch execution context.
  * Local HTTP in-memory or single PostgreSQL schema database.
  * No multi-tenant SaaS routing.

---

## 2. Professional Edition
Targeted at expanding showroom businesses requiring CRM, inventory tracking, and procurement management.
* **Included Modules:**
  * All Community features.
  * **Inventory:** Alphanumeric barcode generation, stock entry logs, and stock movements.
  * **Customer CRM:** Customer KYC profiles, purchase ledgers, and loyalty points.
  * **Procurement:** Supplier logs, purchase orders, and goods receipts.
* **Limitations:**
  * Multi-branch enabled (up to 3 branches).
  * No multi-tenant SaaS routing (dedicated customer database instances).

---

## 3. Enterprise Edition
Targeted at multi-store showroom networks, franchise systems, and manufacturing operators requiring double-entry accounting and savings plans.
* **Included Modules:**
  * All Professional features.
  * **Accounting:** Automatic double-entry journal postings and ledger reporting.
  * **Savings Scheme Management:** Installments tracking, payment splits, gold rate booking locks, and maturity redemptions.
  * **Advanced Reporting:** Profitability dashboards, gold yield projections, and maturity forecasts.
  * **Manufacturing & Repairs:** karigar allocations, melting journals, and repair orders.
* **Capabilities:**
  * Multi-tenant SaaS routing enabled (no branch or user count limits).
  * API Gateway rate-limit filters and Tenant Context isolation middleware.
