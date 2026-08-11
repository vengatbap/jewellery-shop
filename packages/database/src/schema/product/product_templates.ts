import { pgTable, uuid, varchar, text, integer, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { productCategories } from '../catalog/tenant/product_categories.js';
import { brands } from '../catalog/tenant/brands.js';
import { collections } from '../catalog/tenant/collections.js';

export const productTemplates = pgTable('product_templates', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    templateCode: varchar('template_code', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    categoryId: uuid('category_id').references(() => productCategories.id),
    brandId: uuid('brand_id').references(() => brands.id),
    collectionId: uuid('collection_id').references(() => collections.id),
    status: varchar('status', { length: 20 }).default('DRAFT').notNull(), // DRAFT | PUBLISHED | ARCHIVED
    version: integer('version').default(1).notNull(),
    recordVersion: integer('record_version').default(1).notNull(),
    attributes: jsonb('attributes').default({}),
    metadata: jsonb('metadata').default({}),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgCodeIdx: index('idx_product_templates_org_code').on(table.organizationId, table.templateCode),
    orgCategoryIdx: index('idx_product_templates_org_category').on(table.organizationId, table.categoryId),
    orgStatusIdx: index('idx_product_templates_org_status').on(table.organizationId, table.status),
}));
