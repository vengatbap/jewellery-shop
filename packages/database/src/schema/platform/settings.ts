import { pgTable, varchar, uuid, text, integer, boolean, numeric, foreignKey } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, auditColumns } from '../shared/index';
import { organizations } from './organizations';
import { branches } from './branches';

// 1. Generic platform settings (system-wide key-value configuration)
export const platformSettings = pgTable(
    'platform_settings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        key: varchar('key', { length: 255 }).notNull().unique(),
        value: text('value').notNull(),
        ...timestamps(),
        ...softDelete(),
        ...auditColumns(),
    }
);

// 2. Organization / Branch Invoice Settings
export const invoiceSettings = pgTable(
    'invoice_settings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id').notNull(),
        branchId: uuid('branch_id'), // Optional branch override
        prefix: varchar('prefix', { length: 50 }).notNull().default('INV'),
        suffix: varchar('suffix', { length: 50 }),
        nextNumber: integer('next_number').notNull().default(1001),
        taxEnabled: boolean('tax_enabled').notNull().default(true),
        ...timestamps(),
        ...softDelete(),
        ...auditColumns(),
    },
    (table) => ({
        fkOrganization: foreignKey({
            columns: [table.organizationId],
            foreignColumns: [organizations.id],
        }).onDelete('cascade'),
        fkBranch: foreignKey({
            columns: [table.branchId],
            foreignColumns: [branches.id],
        }).onDelete('cascade'),
    })
);

// 3. Organization / Branch Gold Rate Margin Settings
export const goldRateSettings = pgTable(
    'gold_rate_settings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id').notNull(),
        branchId: uuid('branch_id'), // Optional branch override
        marginPercentage: numeric('margin_percentage', { precision: 5, scale: 2 }).notNull().default('2.00'),
        calculationFormula: varchar('calculation_formula', { length: 255 }).notNull().default('BASE_RATE * (1 + MARGIN)'),
        ...timestamps(),
        ...softDelete(),
        ...auditColumns(),
    },
    (table) => ({
        fkOrganization: foreignKey({
            columns: [table.organizationId],
            foreignColumns: [organizations.id],
        }).onDelete('cascade'),
        fkBranch: foreignKey({
            columns: [table.branchId],
            foreignColumns: [branches.id],
        }).onDelete('cascade'),
    })
);

// 4. Organization / Branch Barcode Rules Settings
export const barcodeSettings = pgTable(
    'barcode_settings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id').notNull(),
        branchId: uuid('branch_id'), // Optional branch override
        format: varchar('format', { length: 100 }).notNull().default('JR000001'),
        printTemplate: varchar('print_template', { length: 255 }).notNull().default('standard_38x25'),
        ...timestamps(),
        ...softDelete(),
        ...auditColumns(),
    },
    (table) => ({
        fkOrganization: foreignKey({
            columns: [table.organizationId],
            foreignColumns: [organizations.id],
        }).onDelete('cascade'),
        fkBranch: foreignKey({
            columns: [table.branchId],
            foreignColumns: [branches.id],
        }).onDelete('cascade'),
    })
);

export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InvoiceSetting = typeof invoiceSettings.$inferSelect;
export type GoldRateSetting = typeof goldRateSettings.$inferSelect;
export type BarcodeSetting = typeof barcodeSettings.$inferSelect;
