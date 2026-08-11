import { pgTable, uuid, integer, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { branchTransferShipments } from './branch_transfer_shipments.js';
import { inventoryItems } from '../inventory/inventory_items.js';
import { productVariants } from '../product/product_variants.js';

export const branchTransferItems = pgTable('branch_transfer_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    shipmentId: uuid('shipment_id').notNull().references(() => branchTransferShipments.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id').references(() => inventoryItems.id),
    variantId: uuid('variant_id').references(() => productVariants.id),
    quantity: integer('quantity').default(1).notNull(),
    grossWeightGrams: numeric('gross_weight_grams', { precision: 12, scale: 4 }).notNull(),
    netWeightGrams: numeric('net_weight_grams', { precision: 12, scale: 4 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    shipmentIdx: index('idx_branch_transfer_items_shipment').on(table.shipmentId),
}));
