import { pgTable, uuid, varchar, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';
import { invoices } from './invoices';

export const posReturns = pgTable('pos_returns', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id),
    returnNumber: varchar('return_number', { length: 50 }).notNull(),
    reason: text('reason').notNull(),
    refundAmount: numeric('refund_amount', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgReturnNoIdx: index('idx_pos_returns_org_no').on(table.organizationId, table.returnNumber),
    invoiceIdx: index('idx_pos_returns_invoice').on(table.invoiceId),
}));
