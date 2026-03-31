import { pgTable, uuid, numeric } from "drizzle-orm/pg-core";
import { invoices } from "./invoices.schema";
import { primaryId } from "../shared/common";

export const invoiceItems = pgTable("invoice_items", {
  id: primaryId,
  invoiceId: uuid("invoice_id").references(() => invoices.id),
  inventoryItemId: uuid("inventory_item_id"),
  productId: uuid("product_id"),
  goldRate: numeric("gold_rate"),
  netWeight: numeric("net_weight"),
  makingCharge: numeric("making_charge"),
  wastageAmount: numeric("wastage_amount"),
  stoneAmount: numeric("stone_amount"),
  taxAmount: numeric("tax_amount"),
  total: numeric("total")
});