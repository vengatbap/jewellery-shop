import { pgTable, uuid, numeric } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"
import { inventoryItems } from "./inventory_items.schema"

export const inventoryItemStones = pgTable("inventory_item_stones", {
  id: primaryId,

  inventoryItemId: uuid("inventory_item_id")
    .references(() => inventoryItems.id),

  stoneId: uuid("stone_id"),

  weight: numeric("weight"),

  price: numeric("price")
})