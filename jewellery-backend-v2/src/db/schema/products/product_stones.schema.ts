import { pgTable, uuid, numeric } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"
import { products } from "./products.schema"

export const productStones = pgTable("product_stones", {
  id: primaryId,

  productId: uuid("product_id")
    .references(() => products.id),

  stoneId: uuid("stone_id"),

  defaultWeight: numeric("default_weight"),

  defaultPrice: numeric("default_price")
})