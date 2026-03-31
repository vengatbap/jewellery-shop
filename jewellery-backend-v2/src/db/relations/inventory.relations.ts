import { relations } from "drizzle-orm"

import { inventoryItems } from "../schema/inventory/inventory_items.schema"
import { inventoryItemStones } from "../schema/inventory/inventory_item_stones.schema"
import { barcodeTags } from "../schema/inventory/barcode_tags.schema"
import { products } from "../schema/products/products.schema"

export const inventoryItemsRelations = relations(
  inventoryItems,
  ({ one, many }) => ({
    product: one(products, {
      fields: [inventoryItems.productId],
      references: [products.id]
    }),
    stones: many(inventoryItemStones),
    barcodes: many(barcodeTags)
  })
)