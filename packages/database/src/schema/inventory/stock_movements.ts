import { pgTable, uuid, varchar, numeric, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';
import { inventoryItems } from './inventory_items.js';

export const stockMovements = pgTable('stock_movements', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id').notNull().references(() => inventoryItems.id),
    movementType: varchar('movement_type', { length: 50 }).notNull(), // OPENING_STOCK | ADJ_IN | ADJ_OUT | TRANSFER_OUT | TRANSFER_IN | SALE | RETURN | REPAIR_OUT
    fromBranchId: uuid('from_branch_id').references(() => branches.id),
    toBranchId: uuid('to_branch_id').references(() => branches.id),
    quantity: integer('quantity').default(1).notNull(),
    weight: numeric('weight', { precision: 12, scale: 4 }).notNull(),
    referenceType: varchar('reference_type', { length: 50 }), // INVOICE | TRANSFER_ORDER | PURCHASE_RECEIPT | ADJUSTMENT
    referenceId: uuid('reference_id'),
    createdBy: uuid('created_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgItemIdx: index('idx_stock_movements_org_item').on(table.organizationId, table.itemId),
    orgMovementTypeIdx: index('idx_stock_movements_org_type').on(table.organizationId, table.movementType),
    fromBranchIdx: index('idx_stock_movements_from_branch').on(table.fromBranchId),
    toBranchIdx: index('idx_stock_movements_to_branch').on(table.toBranchId),
}));
