import { pgTable, uuid, text, date, numeric } from "drizzle-orm/pg-core"
import { primaryId, timestamps } from "../shared/common"

export const purchaseOrders = pgTable("purchase_orders", {
  id: primaryId,

  supplierId: uuid("supplier_id"),

  branchId: uuid("branch_id"),

  orderNumber: text("order_number"),

  orderDate: date("order_date"),

  expectedDate: date("expected_date"),

  status: text("status"),

  totalAmount: numeric("total_amount"),

  createdBy: uuid("created_by"),

  ...timestamps
})