import { pgTable, uuid } from "drizzle-orm/pg-core";
import { roles } from "./roles.schema";
import { permissions } from "./permissions.schema";

export const rolePermissions = pgTable("role_permissions", {
  roleId: uuid("role_id").references(() => roles.id),
  permissionId: uuid("permission_id").references(() => permissions.id)
});