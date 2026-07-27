import { pgTable, uuid, index, boolean, integer } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const barcodeStandards = pgTable(
    'barcode_standards',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        supportsCheckDigit: boolean('supports_check_digit').notNull().default(false),
        supports2D: boolean('supports_2d').notNull().default(false),
        supportsGS1: boolean('supports_gs1').notNull().default(false),
        maxLength: integer('max_length'),
        minLength: integer('min_length'),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_barcode_standards_code').on(table.code),
    })
);

export type BarcodeStandard = typeof barcodeStandards.$inferSelect;
export type NewBarcodeStandard = typeof barcodeStandards.$inferInsert;
