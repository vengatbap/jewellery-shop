import { pgTable, varchar, uuid, index, boolean, decimal, integer, foreignKey } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../shared/index';
import { taxCategories } from '../catalog/global/tax_categories';

export const taxRules = pgTable(
    'tax_rules',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        taxCategoryId: uuid('tax_category_id').notNull(),
        rate: decimal('rate', { precision: 5, scale: 2 }).notNull().default('0.00'),
        priority: integer('priority').notNull().default(1),
        compoundTax: boolean('compound_tax').notNull().default(false),
        isDefault: boolean('is_default').notNull().default(false),
        calculationMethod: varchar('calculation_method', { length: 20 }).notNull().default('EXCLUSIVE'), // INCLUSIVE | EXCLUSIVE
        inclusive: boolean('inclusive').notNull().default(false),
        exclusive: boolean('exclusive').notNull().default(true),
        roundingMethod: varchar('rounding_method', { length: 20 }).notNull().default('HALF_UP'),
        ledgerAccountId: uuid('ledger_account_id'),
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkTaxCategory: foreignKey({
            columns: [table.taxCategoryId],
            foreignColumns: [taxCategories.id],
        }).onDelete('restrict'),
        idxCode: index('idx_tax_rules_code').on(table.code),
        idxOrg: index('idx_tax_rules_org').on(table.organizationId),
    })
);

export type TaxRule = typeof taxRules.$inferSelect;
export type NewTaxRule = typeof taxRules.$inferInsert;
