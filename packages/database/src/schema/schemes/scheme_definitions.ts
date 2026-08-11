import { pgTable, uuid, varchar, integer, numeric, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';

export const schemeDefinitions = pgTable('scheme_definitions', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    schemeCode: varchar('scheme_code', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    schemeType: varchar('scheme_type', { length: 30 }).notNull(), // MONEY_BASED | WEIGHT_BASED
    durationMonths: integer('duration_months').notNull(),
    installmentFrequency: varchar('installment_frequency', { length: 20 }).default('MONTHLY').notNull(),
    minimumInstallmentAmount: numeric('minimum_installment_amount', { precision: 12, scale: 2 }).notNull(),
    bonusPercentage: numeric('bonus_percentage', { precision: 5, scale: 2 }).default('0.00').notNull(),
    bonusFixedAmount: numeric('bonus_fixed_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgCodeIdx: index('idx_scheme_def_org_code').on(table.organizationId, table.schemeCode),
}));
