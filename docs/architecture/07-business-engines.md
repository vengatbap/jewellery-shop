# 07. Business Engines

Business calculations are isolated from controller routes. They are packaged as **business libraries** inside `packages/core` or custom modules:

## Core Engines Registry
* **`pricing-engine`**: Calculates weight, wastage, and making charges.
* **`inventory-engine`**: Evaluates stock limits and thresholds.
* **`accounting-engine`**: Determines ledger debit/credit balances.
* **`tax-engine`**: Calculates tax per regional branch jurisdiction.
* **`identifier-engine`**: Single source of truth for sequential alphanumeric IDs (barcodes, invoices).
* **`scheme-bonus-engine`**: Calculates savings plan maturity bonuses and conversion factors.

## Implementation Standard
Engines must be **stateless libraries** containing pure functions. They receive context parameters (e.g. weights, gold rates) and return calculated values without making direct database calls. This guarantees high performance, testability, and portability across different services.
