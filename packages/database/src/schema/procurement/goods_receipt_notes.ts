import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';
import { suppliers } from './suppliers.js';
import { purchaseOrders } from './purchase_orders.js';

export const goodsReceiptNotes = pgTable('goods_receipt_notes', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    supplierId: uuid('supplier_id').notNull().references(() => suppliers.id),
    poId: uuid('po_id').references(() => purchaseOrders.id),
    grnNumber: varchar('grn_number', { length: 50 }).notNull(),
    receivedDate: timestamp('received_date', { withTimezone: true }).defaultNow().notNull(),
    receivedBy: uuid('received_by'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgGrnNoIdx: index('idx_grn_org_no').on(table.organizationId, table.grnNumber),
    poIdx: index('idx_grn_po').on(table.poId),
}));
