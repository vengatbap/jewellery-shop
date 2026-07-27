import {
    pgTable,
    foreignKey,
    index,
    uuid,
} from 'drizzle-orm/pg-core';
import { primaryId } from '../shared/common';
import { timestamps } from '../shared/index';
import { roles } from './roles';
import { permissions } from './permissions';

export const rolePermissions = pgTable(
    'role_permissions',
    {
        id: primaryId,
        roleId: uuid('role_id').notNull(),
        permissionId: uuid('permission_id').notNull(),
        ...timestamps(),
    },
    (table) => ({
        fkRole: foreignKey({
            columns: [table.roleId],
            foreignColumns: [roles.id],
        }).onDelete('cascade'),
        fkPermission: foreignKey({
            columns: [table.permissionId],
            foreignColumns: [permissions.id],
        }).onDelete('cascade'),
        idxRole: index('idx_role_permissions_role_id').on(table.roleId),
        idxPermission: index('idx_role_permissions_permission_id').on(
            table.permissionId
        ),
    })
);

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;
