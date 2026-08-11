import { pgTable, uuid, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { invoices } from './invoices.js';
import { inventoryItems } from '../inventory/inventory_items.js';
import { productVariants } from '../product/product_variants.js';

export const invoiceItems = pgTable('invoice_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id').references(() => inventoryItems.id),
    variantId: uuid('variant_id').references(() => productVariants.id),
    grossWeight: numeric('gross_weight', { precision: 12, scale: 4 }).notNull(),
    netWeight: numeric('net_weight', { precision: 12, scale: 4 }).notNull(),
    stoneWeight: numeric('stone_weight', { precision: 12, scale: 4 }).default('0.0000').notNull(),
    metalRatePerGram: numeric('metal_rate_per_gram', { precision: 12, scale: 2 }).notNull(),
    metalValue: numeric('metal_value', { precision: 12, scale: 2 }).notNull(),
    stoneValue: numeric('stone_value', { precision: 12, scale: 2 }).default('0.00').notNull(),
    makingCharge: numeric('making_charge', { precision: 12, scale: 2 }).default('0.00').notNull(),
    wastageValue: numeric('wastage_value', { precision: 12, scale: 2 }).default('0.00').notNull(),
    discountAmount: numeric('discount_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    taxAmount: numeric('tax_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    totalPrice: numeric('total_price', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    invoiceIdx: index('idx_invoice_items_invoice').on(table.invoiceId),
    itemIdx: index('idx_invoice_items_item').on(table.itemId),
}));
