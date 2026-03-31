import { relations } from "drizzle-orm"

import { repairOrders } from "../schema/repair/repair_orders.schema"
import { customers } from "../schema/customers/customers.schema"

export const repairOrdersRelations = relations(
  repairOrders,
  ({ one }) => ({
    customer: one(customers, {
      fields: [repairOrders.customerId],
      references: [customers.id]
    })
  })
)