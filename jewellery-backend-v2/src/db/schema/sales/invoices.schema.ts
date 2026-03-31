import { pgTable, uuid, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { customers } from "../customers/customers.schema";
import { primaryId } from "../shared/common";

export const invoices = pgTable("invoices", {
  id: primaryId,
  organizationId: uuid("organization_id"),
  branchId: uuid("branch_id"),
  invoiceNumber: text("invoice_number"),
  customerId: uuid("customer_id").references(() => customers.id),
  invoiceDate: timestamp("invoice_date"),
  subtotal: numeric("subtotal"),
  taxAmount: numeric("tax_amount"),
  discountAmount: numeric("discount_amount"),
  grandTotal: numeric("grand_total"),
  status: text("status")
});