import { pgTable, text, numeric } from "drizzle-orm/pg-core";
import { primaryId } from "../shared/common";

export const metals = pgTable("metals", {
  id: primaryId,
  name: text("name"),
  code: text("code"),
  defaultPurity: numeric("default_purity"),
  density: numeric("density")
});