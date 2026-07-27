import { pgTable, uuid, index } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const taxCategories = pgTable(
    'tax_categories',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_tax_categories_code').on(table.code),
    })
);

export type TaxCategory = typeof taxCategories.$inferSelect;
export type NewTaxCategory = typeof taxCategories.$inferInsert;
