import { pgTable, uuid, index } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../../shared/index';

export const designTypes = pgTable(
    'design_types',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_design_types_code').on(table.code),
        idxOrg: index('idx_design_types_org').on(table.organizationId),
    })
);

export type DesignType = typeof designTypes.$inferSelect;
export type NewDesignType = typeof designTypes.$inferInsert;
