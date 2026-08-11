import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';
import { customerProfiles } from '../crm/customer_profiles.js';

export const pawnLoans = pgTable('pawn_loans', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    customerId: uuid('customer_id').notNull().references(() => customerProfiles.id),
    loanNumber: varchar('loan_number', { length: 50 }).notNull(),
    principalAmount: numeric('principal_amount', { precision: 12, scale: 2 }).notNull(),
    interestRateMonthlyPct: numeric('interest_rate_monthly_pct', { precision: 5, scale: 2 }).notNull(),
    ltvPercentage: numeric('ltv_percentage', { precision: 5, scale: 2 }).notNull(),
    appraisedGoldValue: numeric('appraised_gold_value', { precision: 12, scale: 2 }).notNull(),
    startDate: timestamp('start_date', { withTimezone: true }).defaultNow().notNull(),
    dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
    status: varchar('status', { length: 20 }).default('ACTIVE').notNull(), // ACTIVE | REPAID | EXTENDED | FORECLOSED | AUCTIONED
    totalInterestPaid: numeric('total_interest_paid', { precision: 12, scale: 2 }).default('0.00').notNull(),
    principalBalance: numeric('principal_balance', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgLoanNoIdx: index('idx_pawn_loans_org_no').on(table.organizationId, table.loanNumber),
    customerIdx: index('idx_pawn_loans_customer').on(table.customerId),
    branchIdx: index('idx_pawn_loans_branch').on(table.branchId),
}));
