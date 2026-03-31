import { pgTable, uuid, numeric, timestamp, text } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"

export const manufacturingJobs = pgTable("manufacturing_jobs", {
  id: primaryId,

  karigarId: uuid("karigar_id"),

  productId: uuid("product_id"),

  metalWeight: numeric("metal_weight"),

  stoneWeight: numeric("stone_weight"),

  wastagePercent: numeric("wastage_percent"),

  makingCharge: numeric("making_charge"),

  jobStatus: text("job_status"),

  assignedDate: timestamp("assigned_date"),

  completedDate: timestamp("completed_date")
})