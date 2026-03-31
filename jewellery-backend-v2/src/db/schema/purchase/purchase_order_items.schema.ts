import { pgTable, uuid, numeric } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"

export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: primaryId,

  purchaseOrderId: uuid("purchase_order_id"),

  productId: uuid("product_id"),

  quantity: numeric("quantity"),

  grossWeight: numeric("gross_weight"),

  netWeight: numeric("net_weight"),

  price: numeric("price")
})