import { relations } from "drizzle-orm"

import { suppliers } from "../schema/suppliers/suppliers.schema"
import { purchaseOrders } from "../schema/purchase/purchase_orders.schema"

export const suppliersRelations = relations(
  suppliers,
  ({ many }) => ({
    purchaseOrders: many(purchaseOrders)
  })
)