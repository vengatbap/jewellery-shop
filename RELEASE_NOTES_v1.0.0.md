# 🏆 Auric One v1.0.0 Enterprise Release Notes

**Release Date**: July 28, 2026  
**Architecture**: Auric One v1.0 Enterprise Microservices Monorepo  
**Target Platform**: Multi-Tenant Jewellery & Bullion Enterprise Resource Planning System  

---

## 🌟 Major Highlights & Accomplishments

### 1. Multi-Tenant Architecture & Domain Scoping
- Enforced `organization_id` tenant isolation across all PostgreSQL database schemas, repositories, microservice controllers, and API middleware.
- Implemented `branch_id` location awareness across physical inventory, POS invoices, journal entries, gold loans, and inter-branch stock transfers.
- Soft-deletion (`isDeleted`), optimistic concurrency control (`recordVersion`), and audit fields on all entity models.

### 2. Microservices Architecture (16 Microservices & Gateway)
- **`@auric-one/api`**: Unified API Gateway on port `3000` with reverse proxy routing, rate limiting, security headers, request ID tracking, and OpenAPI specification.
- **`@auric-one/catalog-service`**: Global, Industry, and Tenant taxonomy management (`brands`, `collections`, `categories`, `attributes`).
- **`@auric-one/configuration-service`**: Regional tax rules (Bahrain 10% VAT), payment methods, currencies, and sequence generators.
- **`@auric-one/product-service`**: Product templates, variants, metal compositions, stone breakdowns, certificates, and media.
- **`@auric-one/inventory-service`**: Physical item tagging (`item_tag`, `barcode`), stock movements, transfers, adjustments, and reservations.
- **`@auric-one/procurement-service`**: Supplier onboarding, Purchase Orders, Goods Receipt Notes (GRN), purchase invoices, and supplier payments.
- **`@auric-one/gold-rate-service`**: Real-time daily metal rate ticker per metal and purity.
- **`@auric-one/billing-service`**: POS invoicing, Jewellery Pricing Engine (metal value + stone value + making charge + wastage % + tax - discount), split payments, and sales returns.
- **`@auric-one/accounting-service`**: Double-entry Chart of Accounts, Journal vouchers (`Total Debits === Total Credits`), AR/AP sub-ledgers, and Trial Balance reporting.
- **`@auric-one/scheme-service`**: Gold savings schemes (Money-based vs. Weight-based gold rate lock), monthly installment collection, and bonus maturity redemption engine.
- **`@auric-one/customer-service`**: Customer directory, CPR/Civil ID KYC compliance verification, loyalty points ledger, and VIP tiering.
- **`@auric-one/gold-loan-service`**: Gold pawn loans, pledge appraisal valuation (LTV ratio enforcement), interest payments, foreclosures, and auctions.
- **`@auric-one/reporting-service`**: Executive KPI dashboard, daily sales registers, inventory gold weight balances, and stock valuation reports.
- **`@auric-one/ecommerce-service`**: Online storefronts, cart sessions, checkout orders, and payment gateway integration (BenefitPay, Tap, Checkout.com).
- **`@auric-one/multibranch-service`**: Inter-branch inventory shipment dispatch/receiving with stock ownership transfer and regional gold rate offsets.
- **`@auric-one/repair-service`**: Jewellery repair intake job cards, artisan assignments, labor/parts costing, and status tracking.

### 3. Unified SDK Façade (`@auric-one/sdk`)
Mounted all client facades on `PlatformSDK`:
```typescript
import { PlatformSDK } from '@auric-one/sdk';

const sdk = new PlatformSDK({
    catalogUrl: 'http://localhost:3001',
    configurationUrl: 'http://localhost:3002',
    productUrl: 'http://localhost:3004',
    inventoryUrl: 'http://localhost:3005',
    procurementUrl: 'http://localhost:3006',
    goldRateUrl: 'http://localhost:3007',
    billingUrl: 'http://localhost:3008',
    accountingUrl: 'http://localhost:3009',
    schemeUrl: 'http://localhost:3010',
    customerUrl: 'http://localhost:3011',
    goldLoanUrl: 'http://localhost:3012',
    reportingUrl: 'http://localhost:3013',
    ecommerceUrl: 'http://localhost:3014',
    multiBranchUrl: 'http://localhost:3015',
    repairUrl: 'http://localhost:3016',
    identityUrl: 'http://localhost:3003',
    platformUrl: 'http://localhost:3000',
});
```

---

## 🔒 Verification & Release Gate Checklist
- [x] All 15 Sprints implemented in full production detail.
- [x] Multi-tenant isolation verified across every domain table and API route.
- [x] TypeScript compilation clean across all packages and microservices.
- [x] Database migrations and deterministic seeding scripts ready for execution.
