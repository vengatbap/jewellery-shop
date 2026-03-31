import { pgTable, uuid, numeric, date } from "drizzle-orm/pg-core";
import { metals } from "./metals.schema";
import { metalPurity } from "./metal_purity.schema";
import { primaryId } from "../shared/common";

export const metalRates = pgTable("metal_rates", {
  id: primaryId,
  metalId: uuid("metal_id").references(() => metals.id),
  purityId: uuid("purity_id").references(() => metalPurity.id),
  ratePerGram: numeric("rate_per_gram"),
  effectiveDate: date("effective_date"),
  branchId: uuid("branch_id")
});