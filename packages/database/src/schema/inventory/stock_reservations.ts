import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';
import { inventoryItems } from './inventory_items';

export const stockReservations = pgTable('stock_reservations', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id').notNull().references(() => inventoryItems.id),
    reservedByCustomerId: uuid('reserved_by_customer_id'),
    status: varchar('status', { length: 20 }).default('ACTIVE').notNull(), // ACTIVE | EXPIRED | FULFILLED | CANCELLED
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgItemIdx: index('idx_stock_reservations_org_item').on(table.organizationId, table.itemId),
}));
