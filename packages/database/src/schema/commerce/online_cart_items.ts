import { pgTable, uuid, integer, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { onlineCart } from './online_cart.js';
import { productVariants } from '../product/product_variants.js';

export const onlineCartItems = pgTable('online_cart_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    cartId: uuid('cart_id').notNull().references(() => onlineCart.id, { onDelete: 'cascade' }),
    variantId: uuid('variant_id').notNull().references(() => productVariants.id),
    quantity: integer('quantity').default(1).notNull(),
    unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    cartIdx: index('idx_online_cart_items_cart').on(table.cartId),
}));
