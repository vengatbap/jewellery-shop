import { pgTable, uuid, text } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"

export const karigars = pgTable("karigars", {
  id: primaryId,

  organizationId: uuid("organization_id"),

  name: text("name"),

  phone: text("phone"),

  address: text("address"),

  workType: text("work_type")
})