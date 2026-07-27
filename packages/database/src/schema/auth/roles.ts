import {
    pgTable,
    varchar,
    boolean,
    uniqueIndex,
    index,
    foreignKey,
} from 'drizzle-orm/pg-core';
import { primaryId, organizationId } from '../shared/common';
import { timestamps, softDelete } from '../shared/index';
import { organizations } from '../platform/organizations';

export const roles = pgTable(
    'roles',
    {
        id: primaryId,
        organizationId: organizationId,
        name: varchar('name', { length: 100 }).notNull(),
        description: varchar('description', { length: 500 }),
        isSystem: boolean('is_system').notNull().default(false),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkOrganization: foreignKey({
            columns: [table.organizationId],
            foreignColumns: [organizations.id],
        }).onDelete('cascade'),
        idxOrganization: index('idx_roles_organization_id').on(table.organizationId),
        idxIsSystem: index('idx_roles_is_system').on(table.isSystem),
        uniqOrgName: uniqueIndex('uniq_roles_org_name').on(
            table.organizationId,
            table.name,
            table.deletedAt
        ),
    })
);

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
