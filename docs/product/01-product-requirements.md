# Product Requirements Document (PRD): Auric One

## 1. Product Vision
**Auric One** is an Enterprise Jewellery Business Platform designed as a multi-tenant SaaS ecosystem. It provides independent, modular, and security-hardened business domains (Inventory SaaS, Billing POS, Accounting, Savings Schemes, repairs, and manufacturing) that can run unified as a complete ERP or be sold and deployed as standalone commercial SaaS modules.

---

## 2. Target Markets & Customers
* **Jewellery Retailers & Showrooms:** Single-store or multi-branch showroom chains requiring fast POS checkout, gold rate booking, and customer ledger accounting.
* **Wholesalers & Distributors:** B2B distributors requiring weight audits and stock transfer tracking.
* **Manufacturing Houses:** Workshop management tracking gold transfers to karigars (artisans) and melting logs.
* **Pawnbrokers:** Operators requiring gold-collateral loan tracking.

---

## 3. Core Problems Solved
* **System Fragmentation:** Eliminates separate, disconnected software packages for POS, accounting, and saving plans.
* **Calculations Complexity:** Automates multi-factor pricing rules (combining gross/net weight, stone weight, daily gold rate, making charges, and wastage percentages).
* **Audit & Compliance Deficits:** Establishes append-only, transaction-accurate logs for regulatory audit reporting.
* **Multi-Tenant / Branch Data Leakage:** Restricts unauthorized operations via strict tenant and branch scoping.

---

## 4. Key Personas
* **Showroom Owner (CEO/CTO):** Wants unified dashboards, branch performance comparisons, gold rate audit history, and financial yield forecasts.
* **POS Cashier / Sales Associate:** Demands extreme speed, mouse-free keyboard shortcut flows, and instant barcode lookups.
* **Inventory Manager:** Focuses on barcode stock movements, transfers, item status (`in_stock`, `reserved`, `sold`), and metal balance audits.
* **Store Accountant:** Focuses on double-entry accounting journals matching invoice parameters, cash logs, and liability reconciliations.
* **Scheme Customer:** Demands transparency of monthly installment collection, bonus waivers, and maturity gold rate locks.

---

## 5. MVP Scope vs. Future Phase Scope

### MVP Scope (Phases 0–7)
* **API Gateway & Platform:** Auth, RBAC, Tenancy, Logs, Branch routing.
* **Masters Database:** Products, categories, metal purities, and suppliers.
* **Inventory Module:** Alphanumeric barcode tagging, inventory creation, and sale movements.
* **Billing / POS Module:** Pricing engine, invoice generation, payment options (cash, card, UPI), and gold buy-backs.
* **Accounting Module:** Automated journal entries (`JE-xxxxxx`) posted from invoices.
* **Savings Scheme Management:** Installments tracking, payment transaction audits, bonus rules, and POS redemptions.

### Future Phase Scope (Phase 8–9)
* **Advanced Reports & Analytics:** Maturity forecasts, cash flow metrics, yield analysis.
* **Repair Module:** Repair order tracking, karigar assignments, and material costs.
* **Manufacturing Module:** Jobs allocation, wastage reconciliation, and karigar balances.
* **Pawn / Gold Loan:** Collateral valuation, interest rate calculations, and pledge documentation.

---

## 6. Success Metrics & Non-Functional Requirements
* **Response Times:** Page transitions under 2 seconds; POS barcode scan lookup under 300ms.
* **Accuracy:** 100% double-entry validation (Debits must exactly equal Credits).
* **Security & Isolation:** Zero tenant-leakage incidence; JWT-scaffolded auth on every gateway route.
* **Operational Integrity:** Zero double-invoicing collisions (enforced via `X-Idempotency-Key` headers).
* **Audit Traceability:** 100% of write operations tracked with matching UUID identifiers and timestamps.
