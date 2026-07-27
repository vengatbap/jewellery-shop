# Jewellery ERP Microservices Plan

## Boundary Rule

Services communicate through APIs and events, not by reading another service's tables.

Billing must call Inventory for barcode/product data:

```text
Billing/POS -> GET /inventory/items/barcode/{barcode} -> Inventory Service
```

After invoice creation, Billing must notify Inventory:

```text
Billing/POS -> POST /inventory/movements -> Inventory Service
```

## Service Order

1. Auth and tenant platform service
2. Customer/CRM service
3. Inventory service
4. Billing/POS service
5. Gold rate service
6. Accounting service
7. Manufacturing, repair, pawn, schemes, loyalty

## Inventory Service Contract

Base URL in development:

```text
http://localhost:4003
```

Barcode lookup:

```http
GET /inventory/items/barcode/JR000123
```

Billing-facing response fields:

```json
{
  "inventory_item_id": "uuid",
  "product_name": "Gold Ring",
  "category": "Ring",
  "purity": "22K",
  "gross_weight": 12.5,
  "net_weight": 10.8,
  "stone_weight": 1.7,
  "making_charge": 500,
  "wastage_percent": 8,
  "status": "in_stock"
}
```

Sale movement:

```http
POST /inventory/movements
```

```json
{
  "inventory_item_id": "uuid",
  "movement_type": "sale",
  "reference_type": "invoice",
  "reference_id": "invoice_id"
}
```

## Schema Feedback

Required SaaS corrections:

- Add `organization_id` to every business table.
- Add `deleted_at` to long-lived business records.
- Use unique constraints scoped by organization, such as `(organization_id, barcode)`.
- Inventory items need `purchase_price`, `selling_price`, `purchase_receipt_id`, and `added_by`.
- Stock movements need `gross_weight`, `net_weight`, `unit_weight`, `remarks`, and `organization_id`.
- Invoices need `payment_status`, `payment_due_date`, `rounding_amount`, and `notes`.

Recommended missing modules:

- Melting records
- Customer custom orders
- Tag templates
- Customer ledger
- Gold rate source/history
- Pawn/gold loan
