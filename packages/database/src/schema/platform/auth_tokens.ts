import { pgTable, varchar, uuid, timestamp, pgEnum, index, foreignKey } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, auditColumns } from '../shared/index';
import { users } from '../auth/users';
import { organizations } from './organizations';

export const tokenTypeEnum = pgEnum('token_type', [
    'ACCESS',
    'REFRESH',
    'EMAIL_VERIFY',
    'PASSWORD_RESET',
    'API_KEY',
]);

export const authTokens = pgTable(
    'auth_tokens',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
        tokenType: tokenTypeEnum('token_type').notNull(),
        userId: uuid('user_id').notNull(),
        organizationId: uuid('organization_id'),
        expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
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
        idxUser: index('idx_auth_tokens_user_id').on(table.userId),
        idxType: index('idx_auth_tokens_type').on(table.tokenType),
        idxHash: index('idx_auth_tokens_hash').on(table.tokenHash),
    })
);

export type AuthToken = typeof authTokens.$inferSelect;
export type NewAuthToken = typeof authTokens.$inferInsert;
