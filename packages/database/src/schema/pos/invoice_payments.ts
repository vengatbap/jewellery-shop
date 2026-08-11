import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { invoices } from './invoices.js';
import { paymentMethods } from '../configuration/payment_methods.js';

export const invoicePayments = pgTable('invoice_payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
    paymentMethodId: uuid('payment_method_id').notNull().references(() => paymentMethods.id),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    referenceNo: varchar('reference_no', { length: 100 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    invoiceIdx: index('idx_invoice_payments_invoice').on(table.invoiceId),
}));
