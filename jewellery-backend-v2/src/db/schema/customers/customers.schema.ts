import { pgTable, text, uuid, numeric } from "drizzle-orm/pg-core";
import { organizations } from "../tenant/organizations.schema";
import { primaryId, timestamps } from "../shared/common";

export const customers = pgTable("customers", {
  id: primaryId,
  organizationId: uuid("organization_id").references(() => organizations.id),
  customerCode: text("customer_code"),
  name: text("name"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  postalCode: text("postal_code"),
  taxNumber: text("tax_number"),
  creditLimit: numeric("credit_limit"),
  loyaltyPoints: numeric("loyalty_points"),
  ...timestamps
});