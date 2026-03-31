import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { customers } from "./customers.schema";
import { primaryId } from "../shared/common";

export const customerAddresses = pgTable("customer_addresses", {
  id: primaryId,
  customerId: uuid("customer_id").references(() => customers.id),
  type: text("type"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  postalCode: text("postal_code")
});