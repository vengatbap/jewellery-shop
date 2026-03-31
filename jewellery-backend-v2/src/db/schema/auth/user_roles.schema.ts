import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { roles } from "./roles.schema";

export const userRoles = pgTable("user_roles", {
  userId: uuid("user_id").references(() => users.id),
  roleId: uuid("role_id").references(() => roles.id),
  branchId: uuid("branch_id"),
  assignedAt: timestamp("assigned_at")
});