import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';
import { suppliers } from './suppliers';
import { purchaseOrders } from './purchase_orders';
import { goodsReceiptNotes } from './goods_receipt_notes';

export const purchaseInvoices = pgTable('purchase_invoices', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    supplierId: uuid('supplier_id').notNull().references(() => suppliers.id),
    poId: uuid('po_id').references(() => purchaseOrders.id),
    grnId: uuid('grn_id').references(() => goodsReceiptNotes.id),
    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
    invoiceDate: timestamp('invoice_date', { withTimezone: true }).defaultNow().notNull(),
    dueDate: timestamp('due_date', { withTimezone: true }),
    totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric('tax_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    paymentStatus: varchar('payment_status', { length: 20 }).default('PENDING').notNull(), // PENDING | PARTIAL | PAID
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgInvoiceNoIdx: index('idx_purchase_invoices_org_no').on(table.organizationId, table.invoiceNumber),
    supplierIdx: index('idx_purchase_invoices_supplier').on(table.supplierId),
}));
