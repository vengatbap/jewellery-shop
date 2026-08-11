import { pgTable, uuid, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';

export const onlineStores = pgTable('online_stores', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    storeCode: varchar('store_code', { length: 50 }).notNull(),
    storeName: varchar('store_name', { length: 255 }).notNull(),
    domain: varchar('domain', { length: 255 }),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgCodeIdx: index('idx_online_stores_org_code').on(table.organizationId, table.storeCode),
}));
