import { pgTable, uuid, text, numeric, timestamp } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"

export const stockMovements = pgTable("stock_movements", {
  id: primaryId,

  inventoryItemId: uuid("inventory_item_id"),

  branchId: uuid("branch_id"),

  movementType: text("movement_type"),

  referenceType: text("reference_type"),

  referenceId: uuid("reference_id"),

  quantity: numeric("quantity"),

  createdBy: uuid("created_by"),

  createdAt: timestamp("created_at")
})