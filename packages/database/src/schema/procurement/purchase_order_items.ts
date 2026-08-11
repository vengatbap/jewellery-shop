import { pgTable, uuid, varchar, numeric, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { purchaseOrders } from './purchase_orders.js';
import { productVariants } from '../product/product_variants.js';

export const purchaseOrderItems = pgTable('purchase_order_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    poId: uuid('po_id').notNull().references(() => purchaseOrders.id, { onDelete: 'cascade' }),
    variantId: uuid('variant_id').references(() => productVariants.id),
    description: varchar('description', { length: 255 }),
    orderedQuantity: integer('ordered_quantity').default(1).notNull(),
    receivedQuantity: integer('received_quantity').default(0).notNull(),
    unitCost: numeric('unit_cost', { precision: 12, scale: 2 }).notNull(),
    totalCost: numeric('total_cost', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    poIdx: index('idx_po_items_po').on(table.poId),
}));
