import { pgTable, varchar, uuid, index, integer, decimal, foreignKey } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const measurementUnits = pgTable(
    'measurement_units',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        symbol: varchar('symbol', { length: 10 }).notNull(),
        type: varchar('type', { length: 20 }).notNull(), // WEIGHT | COUNT | PACKAGE | LENGTH
        precision: integer('precision').notNull().default(0),
        baseUnitId: uuid('base_unit_id'),
        conversionFactor: decimal('conversion_factor', { precision: 12, scale: 6 }).notNull().default('1.000000'),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkBaseUnit: foreignKey({
            columns: [table.baseUnitId],
            foreignColumns: [table.id],
        }).onDelete('restrict'),
        idxCode: index('idx_measurement_units_code').on(table.code),
    })
);

export type MeasurementUnit = typeof measurementUnits.$inferSelect;
export type NewMeasurementUnit = typeof measurementUnits.$inferInsert;
