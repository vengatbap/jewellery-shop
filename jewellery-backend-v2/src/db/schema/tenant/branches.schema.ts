import { pgTable, text, uuid, boolean } from "drizzle-orm/pg-core";
import { organizations } from "./organizations.schema";
import { primaryId, timestamps } from "../shared/common";

export const branches = pgTable("branches", {
  id: primaryId,
  organizationId: uuid("organization_id").references(() => organizations.id),
  name: text("name"),
  code: text("code"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  phone: text("phone"),
  email: text("email"),
  isActive: boolean("is_active"),
  ...timestamps
});