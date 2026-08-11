import { pgTable, uuid, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';
import { suppliers } from '../procurement/suppliers';

export const supplierLedgers = pgTable('supplier_ledgers', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    supplierId: uuid('supplier_id').notNull().references(() => suppliers.id),
    purchaseInvoiceId: uuid('purchase_invoice_id'),
    debitAmount: numeric('debit_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    creditAmount: numeric('credit_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    balance: numeric('balance', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgSupplierIdx: index('idx_supplier_ledgers_org_supplier').on(table.organizationId, table.supplierId),
}));
