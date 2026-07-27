import {
    pgTable,
    uuid,
    foreignKey,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import {
    primaryId,
    organizationId,
} from '../shared/common';
import { timestamps, softDelete } from '../shared/index';
import { users } from './users';
import { roles } from './roles';
import { branches } from '../platform/branches';

export const userRoles = pgTable(
    'user_roles',
    {
        id: primaryId,
        userId: uuid('user_id').notNull(),
        roleId: uuid('role_id').notNull(),
        organizationId: organizationId,
        branchId: uuid('branch_id'),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkUser: foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
        }).onDelete('cascade'),
        fkRole: foreignKey({
            columns: [table.roleId],
            foreignColumns: [roles.id],
        }).onDelete('cascade'),
        fkBranch: foreignKey({
            columns: [table.branchId],
            foreignColumns: [branches.id],
        }).onDelete('set null'),
        idxUser: index('idx_user_roles_user_id').on(table.userId),
        idxRole: index('idx_user_roles_role_id').on(table.roleId),
        idxBranch: index('idx_user_roles_branch_id').on(table.branchId),
        uniqAssignment: uniqueIndex('uniq_user_role_assignment').on(
            table.userId,
            table.roleId,
            table.branchId
        ),
    })
);

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
