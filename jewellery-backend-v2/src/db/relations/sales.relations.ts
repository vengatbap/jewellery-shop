import { relations } from "drizzle-orm"

import { invoices } from "../schema/sales/invoices.schema"
import { invoiceItems } from "../schema/sales/invoice_items.schema"
import { payments } from "../schema/sales/payments.schema"
import { customers } from "../schema/customers/customers.schema"

export const invoicesRelations = relations(
  invoices,
  ({ many, one }) => ({
    items: many(invoiceItems),
    payments: many(payments),
    customer: one(customers, {
      fields: [invoices.customerId],
      references: [customers.id]
    })
  })
)