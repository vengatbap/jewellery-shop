import { pgTable, uuid, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { productVariants } from './product_variants.js';
import { metals } from '../catalog/industry/metals.js';
import { purities } from '../catalog/industry/purities.js';

export const productMetalCompositions = pgTable('product_metal_compositions', {
    id: uuid('id').defaultRandom().primaryKey(),
    variantId: uuid('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
    metalId: uuid('metal_id').notNull().references(() => metals.id),
    purityId: uuid('purity_id').notNull().references(() => purities.id),
    weight: numeric('weight', { precision: 12, scale: 4 }).notNull(),
    percentage: numeric('percentage', { precision: 5, scale: 2 }).default('100.00').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    variantIdx: index('idx_product_metal_compositions_variant').on(table.variantId),
}));
