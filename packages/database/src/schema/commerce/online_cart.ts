import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { customerProfiles } from '../crm/customer_profiles.js';

export const onlineCart = pgTable('online_cart', {
    id: uuid('id').defaultRandom().primaryKey(),
    cartToken: varchar('cart_token', { length: 100 }).notNull(),
    customerId: uuid('customer_id').references(() => customerProfiles.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    tokenIdx: index('idx_online_cart_token').on(table.cartToken),
}));
