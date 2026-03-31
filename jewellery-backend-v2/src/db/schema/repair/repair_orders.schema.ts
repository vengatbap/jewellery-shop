import { pgTable, uuid, text, numeric, date, timestamp } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"

export const repairOrders = pgTable("repair_orders", {
  id: primaryId,

  customerId: uuid("customer_id"),

  inventoryItemId: uuid("inventory_item_id"),

  description: text("description"),

  expectedDelivery: date("expected_delivery"),

  repairCharge: numeric("repair_charge"),

  status: text("status"),

  receivedDate: timestamp("received_date"),

  deliveredDate: timestamp("delivered_date")
})