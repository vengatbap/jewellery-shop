import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { pawnLoans } from './pawn_loans.js';
import { paymentMethods } from '../configuration/payment_methods.js';

export const pawnPayments = pgTable('pawn_payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    loanId: uuid('loan_id').notNull().references(() => pawnLoans.id, { onDelete: 'cascade' }),
    paymentType: varchar('payment_type', { length: 30 }).notNull(), // INTEREST | PRINCIPAL | BOTH
    amountPaid: numeric('amount_paid', { precision: 12, scale: 2 }).notNull(),
    interestPaidComponent: numeric('interest_paid_component', { precision: 12, scale: 2 }).default('0.00').notNull(),
    principalPaidComponent: numeric('principal_paid_component', { precision: 12, scale: 2 }).default('0.00').notNull(),
    paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
    receiptNumber: varchar('receipt_number', { length: 50 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    loanIdx: index('idx_pawn_payments_loan').on(table.loanId),
}));
