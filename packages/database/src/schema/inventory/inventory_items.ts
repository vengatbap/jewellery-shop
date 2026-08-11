import { pgTable, uuid, varchar, numeric, integer, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';
import { productVariants } from '../product/product_variants.js';

export const inventoryItems = pgTable('inventory_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    variantId: uuid('variant_id').notNull().references(() => productVariants.id),
    itemTag: varchar('item_tag', { length: 100 }).notNull(),
    barcode: varchar('barcode', { length: 100 }).notNull(),
    status: varchar('status', { length: 30 }).default('IN_STOCK').notNull(), // IN_STOCK | RESERVED | SOLD | TRANSFERRED | REPAIR | MELTING | RETURNED
    grossWeight: numeric('gross_weight', { precision: 12, scale: 4 }).notNull(),
    netWeight: numeric('net_weight', { precision: 12, scale: 4 }).notNull(),
    stoneWeight: numeric('stone_weight', { precision: 12, scale: 4 }).default('0.0000').notNull(),
    costPrice: numeric('cost_price', { precision: 12, scale: 2 }),
    sellingPriceOverride: numeric('selling_price_override', { precision: 12, scale: 2 }),
    recordVersion: integer('record_version').default(1).notNull(),
    attributes: jsonb('attributes').default({}),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgTagIdx: index('idx_inventory_items_org_tag').on(table.organizationId, table.itemTag),
    orgBarcodeIdx: index('idx_inventory_items_org_barcode').on(table.organizationId, table.barcode),
    orgBranchStatusIdx: index('idx_inventory_items_org_branch_status').on(table.organizationId, table.branchId, table.status),
    variantIdx: index('idx_inventory_items_variant').on(table.variantId),
}));
