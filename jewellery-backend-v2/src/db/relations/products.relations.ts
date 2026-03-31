import { relations } from "drizzle-orm"

import { products } from "../schema/products/products.schema"
import { productCategories } from "../schema/products/product_categories.schema"
import { productStones } from "../schema/products/product_stones.schema"
import { inventoryItems } from "../schema/inventory/inventory_items.schema"

export const productsRelations = relations(
  products,
  ({ one, many }) => ({
    category: one(productCategories, {
      fields: [products.categoryId],
      references: [productCategories.id]
    }),
    stones: many(productStones),
    inventory: many(inventoryItems)
  })
)