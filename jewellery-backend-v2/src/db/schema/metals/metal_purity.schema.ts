import { pgTable, text, uuid, numeric } from "drizzle-orm/pg-core";
import { metals } from "./metals.schema";
import { primaryId } from "../shared/common";

export const metalPurity = pgTable("metal_purity", {
  id: primaryId,
  metalId: uuid("metal_id").references(() => metals.id),
  purityCode: text("purity_code"),
  purityPercent: numeric("purity_percent"),
  description: text("description")
});