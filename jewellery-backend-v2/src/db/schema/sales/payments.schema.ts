import { pgTable, uuid, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { invoices } from "./invoices.schema";
import { primaryId } from "../shared/common";

export const payments = pgTable("payments", {
  id: primaryId,
  invoiceId: uuid("invoice_id").references(() => invoices.id),
  paymentMethod: text("payment_method"),
  amount: numeric("amount"),
  referenceNumber: text("reference_number"),
  paymentDate: timestamp("payment_date"),
  receivedBy: uuid("received_by")
});