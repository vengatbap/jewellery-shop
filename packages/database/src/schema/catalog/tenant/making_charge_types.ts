import { pgTable, varchar, uuid, index } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../../shared/index';

export const makingChargeTypes = pgTable(
    'making_charge_types',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        calculationMethod: varchar('calculation_method', { length: 20 }).notNull().default('PER_GRAM'), // PER_GRAM | PERCENTAGE | FIXED
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_making_charge_types_code').on(table.code),
        idxOrg: index('idx_making_charge_types_org').on(table.organizationId),
    })
);

export type MakingChargeType = typeof makingChargeTypes.$inferSelect;
export type NewMakingChargeType = typeof makingChargeTypes.$inferInsert;
