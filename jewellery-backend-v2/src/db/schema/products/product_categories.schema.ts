import { pgTable, uuid, text } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"

export const productCategories = pgTable("product_categories", {
  id: primaryId,

  organizationId: uuid("organization_id"),

  name: text("name"),

  description: text("description"),

  parentId: uuid("parent_id")
})