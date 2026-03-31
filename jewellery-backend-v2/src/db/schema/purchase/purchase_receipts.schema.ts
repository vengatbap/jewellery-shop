import { pgTable, uuid, text, date, numeric } from "drizzle-orm/pg-core"
import { primaryId, timestamps } from "../shared/common"

export const purchaseReceipts = pgTable("purchase_receipts", {
  id: primaryId,

  purchaseOrderId: uuid("purchase_order_id"),

  supplierId: uuid("supplier_id"),

  receiptNumber: text("receipt_number"),

  receiptDate: date("receipt_date"),

  branchId: uuid("branch_id"),

  totalAmount: numeric("total_amount"),

  ...timestamps
})