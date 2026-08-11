import { pgTable, uuid, varchar, numeric, text, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';
import { suppliers } from './suppliers.js';

export const purchaseOrders = pgTable('purchase_orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    supplierId: uuid('supplier_id').notNull().references(() => suppliers.id),
    poNumber: varchar('po_number', { length: 50 }).notNull(),
    status: varchar('status', { length: 30 }).default('DRAFT').notNull(), // DRAFT | ORDERED | PARTIAL | RECEIVED | CANCELLED
    orderDate: timestamp('order_date', { withTimezone: true }).defaultNow().notNull(),
    expectedDate: timestamp('expected_date', { withTimezone: true }),
    totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgPoNoIdx: index('idx_purchase_orders_org_no').on(table.organizationId, table.poNumber),
    supplierIdx: index('idx_purchase_orders_supplier').on(table.supplierId),
    branchIdx: index('idx_purchase_orders_branch').on(table.branchId),
}));
