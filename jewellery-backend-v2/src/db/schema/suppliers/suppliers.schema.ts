import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import { primaryId, timestamps } from "../shared/common"
import { organizations } from "../tenant/organizations.schema"

export const suppliers = pgTable("suppliers", {
  id: primaryId,

  organizationId: uuid("organization_id")
    .references(() => organizations.id),

  supplierCode: text("supplier_code"),

  name: text("name"),

  phone: text("phone"),

  email: text("email"),

  address: text("address"),

  city: text("city"),

  country: text("country"),

  taxNumber: text("tax_number"),

  paymentTerms: text("payment_terms"),

  ...timestamps
})