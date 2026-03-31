import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { organizations } from "../tenant/organizations.schema";
import { primaryId, timestamps } from "../shared/common";

export const users = pgTable("users", {
  id: primaryId,
  organizationId: uuid("organization_id").references(() => organizations.id),
  email: text("email").unique(),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  status: text("status"),
  lastLogin: timestamp("last_login"),
  ...timestamps
});