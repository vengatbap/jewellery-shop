# 09. Savings Scheme Management

This module manages Gold Savings and purchase schemes common to the jewellery retail market.

## 1. Business Flow
1. **Enroll**: Customer selects a scheme type and opens an account.
2. **Collect**: Monthly fixed or flexible installments are collected.
3. **Track**: Payments and accumulated weights or values are updated.
4. **Mature**: Upon maturity, bonus rules are evaluated (e.g., 12th installment free).
5. **Redeem**: Customer buys jewellery via POS; scheme value is applied as a tender discount.
6. **Settle**: Balance is finalized, invoice generated, and scheme account closed.

---

## 2. Database Schema Definition

### `saving_schemes` (Plan Definitions)
```text
- id: UUID (PK)
- organization_id: UUID (FK)
- scheme_code: VARCHAR(50) (UNIQUE)
- name: VARCHAR(255)
- description: TEXT
- scheme_type: ENUM (
    'monthly_fixed', 
    'monthly_flexible', 
    'gold_weight', 
    'gold_value', 
    'festival_scheme', 
    'wedding_scheme', 
    'corporate_scheme'
  )
- rate_policy: ENUM (
    'booking_rate', 
    'maturity_rate', 
    'lowest_rate', 
    'average_rate', 
    'manual'
  )
- duration_months: INTEGER
- monthly_amount: NUMERIC
- minimum_amount: NUMERIC
- maximum_amount: NUMERIC
- bonus_type: ENUM ('installment_waiver', 'fixed_bonus', 'percentage_discount')
- bonus_value: NUMERIC
- allow_partial_payment: BOOLEAN
- grace_days: INTEGER
- status: ENUM ('active', 'suspended', 'retired')
- timestamps (created_at, updated_at, deleted_at)
```

### `scheme_accounts` (Customer Enrollments)
```text
- id: UUID (PK)
- organization_id: UUID (FK)
- scheme_id: UUID (FK to saving_schemes)
- customer_id: UUID (FK to customers)
- account_number: VARCHAR(50) (UNIQUE)
- branch_id: UUID (FK to branches)
- start_date: DATE
- maturity_date: DATE
- status: ENUM ('active', 'matured', 'redeemed', 'refunded', 'extended', 'terminated')
- total_paid: NUMERIC
- total_bonus: NUMERIC
- total_value: NUMERIC
- closed_at: TIMESTAMPTZ
- timestamps
```

### `scheme_installments` (Installments ledger)
```text
- id: UUID (PK)
- organization_id: UUID (FK)
- scheme_account_id: UUID (FK to scheme_accounts)
- installment_number: INTEGER
- due_date: DATE
- amount: NUMERIC
- paid_amount: NUMERIC
- paid_date: TIMESTAMPTZ
- payment_status: ENUM ('unpaid', 'paid', 'partially_paid', 'overdue')
- payment_method: VARCHAR(50)
- receipt_number: VARCHAR(50) (UNIQUE)
```

### `scheme_payment_transactions` (Payment transaction splits & audits)
```text
- id: UUID (PK)
- organization_id: UUID (FK)
- scheme_account_id: UUID (FK to scheme_accounts)
- installment_id: UUID (FK to scheme_installments, NULLABLE for generic prepayments)
- transaction_number: VARCHAR(50) (UNIQUE)
- payment_method: ENUM ('cash', 'card', 'upi', 'bank_transfer', 'cheque')
- amount: NUMERIC
- reference_number: VARCHAR(100) (e.g., UPI Transaction ID, cheque reference)
- transaction_date: TIMESTAMPTZ
- received_by: UUID (FK to users)
- remarks: TEXT
- status: ENUM ('success', 'failed', 'refunded', 'reversed')
- timestamps (created_at, updated_at)
```

### `scheme_redemption_rules` (Configurable redemption constraints)
```text
- id: UUID (PK)
- scheme_id: UUID (FK to saving_schemes)
- minimum_months: INTEGER (e.g., minimum payments required before maturity benefits apply)
- allowed_categories: JSONB (list of product category IDs eligible for redemption)
- maximum_discount: NUMERIC (cap on total promotional/bonus discount)
- allow_cash_refund: BOOLEAN
- allow_partial_redemption: BOOLEAN
```

### `scheme_bonus_rules` (Promo/Bonus rules)
```text
- id: UUID (PK)
- scheme_id: UUID (FK to saving_schemes)
- rule_type: VARCHAR(50)
- bonus_value: NUMERIC
- conditions: JSONB
```

---

## 3. Domain Events

The savings scheme service publishes the following events for system-wide consumption:
* **`SchemeCreated`**: Triggered when a new saving plan is defined by the organization.
* **`SchemeEnrolled`**: Triggered when a customer opens a new scheme account.
* **`SchemeInstallmentPaid`**: Triggered when an installment is successfully paid (registers the payment transaction).
* **`SchemeInstallmentMissed`**: Triggered by cron reminder when due date passes without payment.
* **`SchemeMatured`**: Triggered when the duration is complete and all installments are settled.
* **`SchemeRedeemed`**: Triggered when mature funds are converted to invoice tenders.
* **`SchemeClosed`**: Triggered when the account is settled and officially deactivated.

---

## 4. Accounting Integration

* **Installment Collection (Liability Recognition)**:
  * **Debit**: Cash / Bank Account (Asset)
  * **Credit**: Scheme Liability Account (Liability)
* **Scheme Redemption (Settlement)**:
  * **Debit**: Scheme Liability Account (Liability)
  * **Credit**: Sales Revenue Account (Income)

---

## 5. Permissions Registry
* `scheme:create` - Define new schemes
* `scheme:update` - Adjust settings of defined schemes
* `scheme:enroll` - Register customer account into a scheme
* `scheme:collect-payment` - Process installment receipt entries
* `scheme:mature` - Authorize scheme maturity status
* `scheme:close` - Terminate or complete redemption settlement

---

## 6. Reports & Analytics Requirements
* **Collection Summary**: Real-time intake breakdown by cash, card, and UPI.
* **Outstanding Installments**: List of accounts with missed payments or overdue grace periods.
* **Maturity Forecast**: Calendar/Projection of schemes maturing in the next 30, 60, and 90 days (helps predict cash-out and gold inventory requirements).
* **Bonus Liability**: Financial calculation of committed waivers or discount liabilities.
* **Redemption Conversion**: Analytics tracking the conversion of matured schemes to gold purchases.
* **Branch-wise Collections**: Comparison of savings scheme collection performance across branches.
