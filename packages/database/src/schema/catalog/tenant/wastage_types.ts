import { pgTable, varchar, uuid, index } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../../shared/index';

export const wastageTypes = pgTable(
    'wastage_types',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        calculationMethod: varchar('calculation_method', { length: 20 }).notNull().default('PER_GRAM'), // PER_GRAM | PERCENTAGE | FIXED
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_wastage_types_code').on(table.code),
        idxOrg: index('idx_wastage_types_org').on(table.organizationId),
    })
);

export type WastageType = typeof wastageTypes.$inferSelect;
export type NewWastageType = typeof wastageTypes.$inferInsert;
