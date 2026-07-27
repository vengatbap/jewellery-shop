import {
    pgTable,
    varchar,
    foreignKey,
    uniqueIndex,
    index,
    uuid,
} from 'drizzle-orm/pg-core';
import {
    timestamps,
    softDelete,
    auditColumns,
    branchStatusEnum,
} from '../shared/index';
import { organizations } from './organizations';

export const branches = pgTable(
    'branches',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        businessId: varchar('business_id', { length: 20 }).notNull(),
        organizationId: uuid('organization_id').notNull(),
        name: varchar('name', { length: 255 }).notNull(),
        code: varchar('code', { length: 20 }).notNull(),
        managerName: varchar('manager_name', { length: 255 }),
        email: varchar('email', { length: 255 }),
        phone: varchar('phone', { length: 20 }),
        address: varchar('address', { length: 500 }),
        city: varchar('city', { length: 100 }),
        state: varchar('state', { length: 100 }),
        country: varchar('country', { length: 2 }).default('IN'),
        status: branchStatusEnum('status').notNull().default('ACTIVE'),
        ...timestamps(),
        ...softDelete(),
        ...auditColumns(),
    },
    (table) => ({
        fkOrganization: foreignKey({
            columns: [table.organizationId],
            foreignColumns: [organizations.id],
        }).onDelete('cascade'),
        idxOrganization: index('idx_branches_organization_id').on(table.organizationId),
        idxStatus: index('idx_branches_status').on(table.status),
        uniqCode: uniqueIndex('uniq_branches_org_code').on(
            table.organizationId,
            table.code,
            table.deletedAt
        ),
    })
);

export type Branch = typeof branches.$inferSelect;
export type NewBranch = typeof branches.$inferInsert;
