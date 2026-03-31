import { pgTable, uuid, text } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"
import { organizations } from "../tenant/organizations.schema"

export const accounts = pgTable("accounts", {

  id: primaryId,

  organizationId: uuid("organization_id")
    .references(() => organizations.id),

  accountName: text("account_name").notNull(),

  accountType: text("account_type").notNull(),

  parentAccount: uuid("parent_account")

})