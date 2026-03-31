import { pgTable, uuid, text, numeric } from "drizzle-orm/pg-core"
import { primaryId, timestamps } from "../shared/common"

export const products = pgTable("products", {
  id: primaryId,

  organizationId: uuid("organization_id"),

  productCode: text("product_code"),

  name: text("name"),

  categoryId: uuid("category_id"),

  metalId: uuid("metal_id"),

  defaultPurityId: uuid("default_purity_id"),

  description: text("description"),

  imageUrl: text("image_url"),

  defaultWastagePercent: numeric("default_wastage_percent"),

  defaultMakingCharge: numeric("default_making_charge"),

  ...timestamps
})