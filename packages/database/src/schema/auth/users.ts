import {
    pgTable,
    varchar,
    foreignKey,
    index,
    uniqueIndex,
    timestamp,
} from 'drizzle-orm/pg-core';
import {
    primaryId,
    organizationId,
    userStatusEnum,
} from '../shared/common';
import { timestamps, softDelete } from '../shared/index';
import { organizations } from '../platform/organizations';

export const users = pgTable(
    'users',
    {
        id: primaryId,
        organizationId: organizationId,
        email: varchar('email', { length: 255 }).notNull(),
        passwordHash: varchar('password_hash', { length: 255 }).notNull(),
        firstName: varchar('first_name', { length: 100 }),
        lastName: varchar('last_name', { length: 100 }),
        phone: varchar('phone', { length: 20 }),
        status: userStatusEnum('status').notNull().default('ACTIVE'),
        lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkOrganization: foreignKey({
            columns: [table.organizationId],
            foreignColumns: [organizations.id],
        }).onDelete('cascade'),
        idxEmail: index('idx_users_email').on(table.email),
        idxOrganization: index('idx_users_organization_id').on(table.organizationId),
        idxStatus: index('idx_users_status').on(table.status),
        uniqOrgEmail: uniqueIndex('uniq_users_org_email').on(
            table.organizationId,
            table.email,
            table.deletedAt
        ),
    })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
