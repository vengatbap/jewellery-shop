import { pgTable, varchar, uuid, index, integer, boolean, decimal } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const currencies = pgTable(
    'currencies',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        symbol: varchar('symbol', { length: 10 }).notNull(),
        decimalPlaces: integer('decimal_places').notNull().default(2),
        minorUnit: integer('minor_unit').notNull().default(100), // e.g. 100 for cents/fils
        symbolPosition: varchar('symbol_position', { length: 10 }).notNull().default('BEFORE'), // BEFORE | AFTER
        roundingPrecision: decimal('rounding_precision', { precision: 5, scale: 4 }).notNull().default('0.0100'),
        isBaseCurrency: boolean('is_base_currency').notNull().default(false),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_currencies_code').on(table.code),
    })
);

export type Currency = typeof currencies.$inferSelect;
export type NewCurrency = typeof currencies.$inferInsert;
