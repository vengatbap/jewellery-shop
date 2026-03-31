import { pgTable, text } from "drizzle-orm/pg-core";
import { primaryId } from "../shared/common";

export const permissions = pgTable("permissions", {
  id: primaryId,
  code: text("code"),
  name: text("name"),
  module: text("module"),
  description: text("description")
});