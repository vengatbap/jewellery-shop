import { pgTable, text, uuid, boolean } from "drizzle-orm/pg-core";
import { organizations } from "../tenant/organizations.schema";
import { primaryId } from "../shared/common";

export const roles = pgTable("roles", {
  id: primaryId,
  organizationId: uuid("organization_id").references(() => organizations.id),
  name: text("name"),
  description: text("description"),
  isSystem: boolean("is_system")
});