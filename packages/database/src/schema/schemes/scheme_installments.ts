import { pgTable, uuid, varchar, integer, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { customerSchemes } from './customer_schemes.js';
import { paymentMethods } from '../configuration/payment_methods.js';

export const schemeInstallments = pgTable('scheme_installments', {
    id: uuid('id').defaultRandom().primaryKey(),
    schemeAccountId: uuid('scheme_account_id').notNull().references(() => customerSchemes.id, { onDelete: 'cascade' }),
    installmentNo: integer('installment_no').notNull(),
    dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
    paidDate: timestamp('paid_date', { withTimezone: true }).defaultNow().notNull(),
    amountPaid: numeric('amount_paid', { precision: 12, scale: 2 }).notNull(),
    metalRateAtPayment: numeric('metal_rate_at_payment', { precision: 12, scale: 2 }),
    weightCreditedGrams: numeric('weight_credited_grams', { precision: 12, scale: 4 }).default('0.0000').notNull(),
    paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
    receiptNumber: varchar('receipt_number', { length: 50 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    schemeAccountIdx: index('idx_scheme_installments_account').on(table.schemeAccountId),
}));
