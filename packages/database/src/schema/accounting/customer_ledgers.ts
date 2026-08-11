import { pgTable, uuid, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';

export const customerLedgers = pgTable('customer_ledgers', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    customerId: uuid('customer_id').notNull(),
    invoiceId: uuid('invoice_id'),
    debitAmount: numeric('debit_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    creditAmount: numeric('credit_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    balance: numeric('balance', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgCustomerIdx: index('idx_customer_ledgers_org_customer').on(table.organizationId, table.customerId),
}));
