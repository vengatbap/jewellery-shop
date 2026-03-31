import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "../shared/common";

export const organizations = pgTable("organizations", {
  id: primaryId,
  name: text("name").notNull(),
  legalName: text("legal_name"),
  registrationNumber: text("registration_number"),
  taxNumber: text("tax_number"),
  currency: text("currency"),
  timezone: text("timezone"),
  logoUrl: text("logo_url"),
  ...timestamps
});