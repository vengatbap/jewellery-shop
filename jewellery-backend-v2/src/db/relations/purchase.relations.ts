import { relations } from "drizzle-orm"

import { purchaseOrders } from "../schema/purchase/purchase_orders.schema"
import { purchaseOrderItems } from "../schema/purchase/purchase_order_items.schema"
import { purchaseReceipts } from "../schema/purchase/purchase_receipts.schema"

export const purchaseOrdersRelations = relations(
  purchaseOrders,
  ({ many }) => ({
    items: many(purchaseOrderItems),
    receipts: many(purchaseReceipts)
  })
)