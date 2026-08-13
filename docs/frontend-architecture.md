# Auric One ERP — Architecture & Portal Document (`v1.0.0-Post-RC1`)

## Overview & Architecture Status

This document records the official release status, 16-domain operational topology, component boundaries, loading/error matrix, and browser UAT verification plan for Auric One ERP.

> **Release Designation:** `v1.0.0 — Post-RC1 Targeted Update`  
> **Development Status:** **FEATURE FREEZE ACTIVE** (Broad feature development paused; Browser UAT Mode active).

---

## 1. 16 Operational Domain Topology

```text
Auric One ERP Portal (16 Operational Domains)
│
├── Retail Core
│   ├── Dashboard (`/`)
│   ├── POS / Billing (`/pos`)
│   ├── Product Catalog (`/products`)
│   ├── Inventory (`/inventory`)
│   └── Gold Rates (`/gold-rates`)
│
├── Customer & Financial
│   ├── Customers & KYC (`/customers`)
│   ├── Savings Schemes (`/schemes`)
│   ├── Gold Loans / Pawn (`/gold-loans`)
│   └── Accounting (`/accounting`)
│
├── Operations
│   ├── Procurement (`/procurement`)
│   ├── Multi-Branch (`/multibranch`)
│   └── Repair & Service (`/repair`)
│
├── Digital
│   ├── E-Commerce (`/ecommerce`)
│   └── Analytics & Reports (`/reports`)
│
└── Platform Governance
    ├── System Configuration (`/configuration`)
    └── Audit & Security Logs (`/audit`)
```

---

## 2. Browser UAT Protocol (17 Execution Steps)

```text
1. Auth / Tenant / Branch Context (Headers & Tenant Isolation)
2. Dashboard (Executive KPIs & Tickers)
3. Customers (Profile Creation & KYC Documents)
4. Products (Jewellery Templates & Barcode Generation)
5. Inventory (Stock Balance & Movement Logs)
6. Gold Rates (Regional Rates & Margin Offset Calculation)
7. POS → Payment → Invoice (Retail Checkout Journey)
8. Accounting Reconciliation (Journal Vouchers & Ledgers)
9. Procurement → GRN → Inventory (Supplier Receiving Journey)
10. Repair Workflow (Job Cards & Artisan Labor)
11. Savings Scheme (Enrollment & Monthly Installments)
12. Gold Loan (Collateral Pledge & Interest Calculation)
13. Multi-Branch Transfer (Inter-Branch Shipment & Ownership Invariant)
14. E-Commerce (Webstore Orders & Webhooks)
15. Reports (Financial Summary & VAT NBR Tax Reports)
16. Configuration (Tax Rules, Concurrency & Barcode Settings)
17. Audit (Immutable Security Log Trail)
```

---

## 3. Defect Resolution Release Governance Rule

Any issue or anomaly identified during browser UAT must follow this strict governance pipeline:

```text
Browser Finding
      ↓
Reproduce (Isolate exact trigger)
      ↓
Classify (Severity: P0 Blocker, P1 Major, P2 Minor)
      ↓
Minimal Targeted Fix (Strict scope, no speculative edits)
      ↓
Typecheck (`pnpm --filter=@auric-one/web typecheck`)
      ↓
Retest (Verify target fix)
      ↓
Regression (Verify adjacent workflows)
      ↓
Document (Update UAT log & Walkthrough)
```

---

## 4. State Matrix Standard across all 16 Routes

| Domain | Loading Skeleton | Empty State | Error State | Retry Trigger | Mutation Pending | Success Feedback |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | — | — |
| **POS** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Products** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Inventory** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Procurement** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Gold Rates** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Customers** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Schemes** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Gold Loans** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Accounting** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Reports** | ✅ | ✅ | ✅ | ✅ | — | — |
| **E-Commerce** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Multi-Branch** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Repair** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Configuration** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Audit** | ✅ | ✅ | ✅ | ✅ | — | — |

---

## 5. Verification Command

```bash
pnpm --filter=@auric-one/web --filter=@auric-one/repair-service typecheck
# Result: Exit status 0 (0 errors)
```
