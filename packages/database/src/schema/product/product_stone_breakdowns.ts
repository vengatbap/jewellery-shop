import { pgTable, uuid, varchar, numeric, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { productVariants } from './product_variants.js';

export const productStoneBreakdowns = pgTable('product_stone_breakdowns', {
    id: uuid('id').defaultRandom().primaryKey(),
    variantId: uuid('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
    stoneType: varchar('stone_type', { length: 50 }).notNull(), // DIAMOND | RUBY | EMERALD | SAPPHIRE | PEARL | OTHER
    cut: varchar('cut', { length: 50 }),
    color: varchar('color', { length: 50 }),
    clarity: varchar('clarity', { length: 50 }),
    pieces: integer('pieces').default(1).notNull(),
    caratWeight: numeric('carat_weight', { precision: 10, scale: 4 }).notNull(),
    ratePerCarat: numeric('rate_per_carat', { precision: 12, scale: 2 }),
    totalAmount: numeric('total_amount', { precision: 12, scale: 2 }),
    settingType: varchar('setting_type', { length: 50 }), // PRONG | BEZEL | PAVÉ | CHANNEL
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    variantIdx: index('idx_product_stone_breakdowns_variant').on(table.variantId),
}));
