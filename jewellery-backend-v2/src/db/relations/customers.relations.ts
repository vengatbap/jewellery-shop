import { relations } from "drizzle-orm"

import { customers } from "../schema/customers/customers.schema"
import { customerAddresses } from "../schema/customers/customer_addresses.schema"
import { invoices } from "../schema/sales/invoices.schema"

export const customersRelations = relations(
  customers,
  ({ many }) => ({
    addresses: many(customerAddresses),
    invoices: many(invoices)
  })
)

export const customerAddressesRelations = relations(
  customerAddresses,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customerAddresses.customerId],
      references: [customers.id]
    })
  })
)