import { relations } from "drizzle-orm"

import { organizations } from "../schema/tenant/organizations.schema"
import { branches } from "../schema/tenant/branches.schema"

export const organizationsRelations = relations(
  organizations,
  ({ many }) => ({
    branches: many(branches)
  })
)

export const branchesRelations = relations(
  branches,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [branches.organizationId],
      references: [organizations.id]
    })
  })
)