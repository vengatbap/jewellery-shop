import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';
import { schemeDefinitions } from './scheme_definitions.js';

export const customerSchemes = pgTable('customer_schemes', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    schemeId: uuid('scheme_id').notNull().references(() => schemeDefinitions.id),
    customerId: uuid('customer_id').notNull(),
    accountNumber: varchar('account_number', { length: 50 }).notNull(),
    enrollmentDate: timestamp('enrollment_date', { withTimezone: true }).defaultNow().notNull(),
    maturityDate: timestamp('maturity_date', { withTimezone: true }).notNull(),
    status: varchar('status', { length: 20 }).default('ACTIVE').notNull(), // ACTIVE | MATURED | REDEEMED | CANCELLED
    totalAmountPaid: numeric('total_amount_paid', { precision: 12, scale: 2 }).default('0.00').notNull(),
    totalWeightAccumulatedGrams: numeric('total_weight_accumulated_grams', { precision: 12, scale: 4 }).default('0.0000').notNull(),
    maturedBonusAmount: numeric('matured_bonus_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgAccNoIdx: index('idx_customer_schemes_org_acc').on(table.organizationId, table.accountNumber),
    customerIdx: index('idx_customer_schemes_customer').on(table.customerId),
}));
