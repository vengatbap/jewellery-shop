import { pgTable, uuid, varchar, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';
import { suppliers } from './suppliers';

export const purchaseReturns = pgTable('purchase_returns', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    supplierId: uuid('supplier_id').notNull().references(() => suppliers.id),
    returnNumber: varchar('return_number', { length: 50 }).notNull(),
    reason: text('reason').notNull(),
    totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgReturnNoIdx: index('idx_purchase_returns_org_no').on(table.organizationId, table.returnNumber),
    supplierIdx: index('idx_purchase_returns_supplier').on(table.supplierId),
}));
