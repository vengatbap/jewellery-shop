import { pgTable, varchar, uuid, timestamp, text, index, foreignKey } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, auditColumns } from '../shared/index';
import { users } from '../auth/users';
import { organizations } from './organizations';
import { branches } from './branches';
import { authTokens } from './auth_tokens';

export const sessions = pgTable(
    'sessions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id').notNull(),
        organizationId: uuid('organization_id'),
        branchId: uuid('branch_id'),
        currentBranchId: uuid('current_branch_id'),
        refreshTokenId: uuid('refresh_token_id').notNull().unique(),
        ipAddress: varchar('ip_address', { length: 45 }),
        userAgent: text('user_agent'),
        deviceName: varchar('device_name', { length: 255 }),
        deviceId: varchar('device_id', { length: 255 }),
        lastActivity: timestamp('last_activity', { withTimezone: true }).notNull().defaultNow(),
        revokedAt: timestamp('revoked_at', { withTimezone: true }),
        revokedReason: varchar('revoked_reason', { length: 255 }),
        ...timestamps(),
        ...softDelete(),
        ...auditColumns(),
    },
    (table) => ({
        fkUser: foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
        }).onDelete('cascade'),
        fkOrganization: foreignKey({
            columns: [table.organizationId],
            foreignColumns: [organizations.id],
        }).onDelete('cascade'),
        fkBranch: foreignKey({
            columns: [table.branchId],
            foreignColumns: [branches.id],
        }).onDelete('cascade'),
        fkCurrentBranch: foreignKey({
            columns: [table.currentBranchId],
            foreignColumns: [branches.id],
        }).onDelete('set null'),
        fkRefreshToken: foreignKey({
            columns: [table.refreshTokenId],
            foreignColumns: [authTokens.id],
        }).onDelete('cascade'),
        idxUser: index('idx_sessions_user_id').on(table.userId),
        idxRefreshToken: index('idx_sessions_refresh_token_id').on(table.refreshTokenId),
        idxLastActivity: index('idx_sessions_last_activity').on(table.lastActivity),
    })
);

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
