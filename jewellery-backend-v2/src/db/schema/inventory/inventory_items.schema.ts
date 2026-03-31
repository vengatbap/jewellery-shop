import {
  pgTable,
  uuid,
  text,
  numeric,
  boolean,
  timestamp
} from "drizzle-orm/pg-core"

export const inventoryItems = pgTable(
  "inventory_items",
  {

    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id"),

    productId: uuid("product_id"),

    branchId: uuid("branch_id"),

    barcode: text("barcode"),

    serialNumber: text("serial_number"),

    grossWeight: numeric("gross_weight"),

    netWeight: numeric("net_weight"),

    stoneWeight: numeric("stone_weight"),

    purityId: uuid("purity_id"),

    wastagePercent: numeric("wastage_percent"),

    makingCharge: numeric("making_charge"),

    status: text("status"),

    isSold: boolean("is_sold"),

    createdAt: timestamp("created_at"),

    updatedAt: timestamp("updated_at")

  }
)