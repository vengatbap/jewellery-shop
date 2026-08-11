import { pgTable, uuid, varchar, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { suppliers } from './suppliers.js';
import { paymentMethods } from '../configuration/payment_methods.js';

export const supplierPayments = pgTable('supplier_payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    supplierId: uuid('supplier_id').notNull().references(() => suppliers.id),
    paymentNumber: varchar('payment_number', { length: 50 }).notNull(),
    paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    paymentDate: timestamp('payment_date', { withTimezone: true }).defaultNow().notNull(),
    referenceNo: varchar('reference_no', { length: 100 }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgPaymentNoIdx: index('idx_supplier_payments_org_no').on(table.organizationId, table.paymentNumber),
    supplierIdx: index('idx_supplier_payments_supplier').on(table.supplierId),
}));
