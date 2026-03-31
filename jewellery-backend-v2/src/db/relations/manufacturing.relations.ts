import { relations } from "drizzle-orm"

import { karigars } from "../schema/manufacturing/karigars.schema"
import { manufacturingJobs } from "../schema/manufacturing/manufacturing_jobs.schema"

export const karigarsRelations = relations(
  karigars,
  ({ many }) => ({
    jobs: many(manufacturingJobs)
  })
)