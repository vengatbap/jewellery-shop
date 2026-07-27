import { pgTable, uuid, index, decimal } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const purities = pgTable(
    'purities',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        purityValue: decimal('purity_value', { precision: 5, scale: 4 }).notNull(), // e.g. 0.9160
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_purities_code').on(table.code),
    })
);

export type Purity = typeof purities.$inferSelect;
export type NewPurity = typeof purities.$inferInsert;
