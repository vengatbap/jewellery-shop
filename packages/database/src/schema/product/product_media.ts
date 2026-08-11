import { pgTable, uuid, varchar, boolean, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { productTemplates } from './product_templates.js';
import { productVariants } from './product_variants.js';

export const productMedia = pgTable('product_media', {
    id: uuid('id').defaultRandom().primaryKey(),
    templateId: uuid('template_id').references(() => productTemplates.id, { onDelete: 'cascade' }),
    variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }),
    url: varchar('url', { length: 500 }).notNull(),
    mediaType: varchar('media_type', { length: 20 }).default('IMAGE').notNull(), // IMAGE | VIDEO | 3D_MODEL
    isPrimary: boolean('is_primary').default(false).notNull(),
    displayOrder: integer('display_order').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    templateMediaIdx: index('idx_product_media_template').on(table.templateId),
    variantMediaIdx: index('idx_product_media_variant').on(table.variantId),
}));
