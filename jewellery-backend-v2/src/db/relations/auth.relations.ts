import { relations } from "drizzle-orm"

import { users } from "../schema/auth/users.schema"
import { roles } from "../schema/auth/roles.schema"
import { userRoles } from "../schema/auth/user_roles.schema"
import { rolePermissions } from "../schema/auth/role_permissions.schema"
import { permissions } from "../schema/auth/permissions.schema"

export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles)
}))

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(userRoles),
  permissions: many(rolePermissions)
}))

export const permissionsRelations = relations(
  permissions,
  ({ many }) => ({
    roles: many(rolePermissions)
  })
)