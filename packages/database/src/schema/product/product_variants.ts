import { pgTable, uuid, varchar, numeric, integer, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { productTemplates } from './product_templates.js';
import { metals } from '../catalog/industry/metals.js';
import { purities } from '../catalog/industry/purities.js';

export const productVariants = pgTable('product_variants', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    templateId: uuid('template_id').notNull().references(() => productTemplates.id, { onDelete: 'cascade' }),
    sku: varchar('sku', { length: 100 }).notNull(),
    variantName: varchar('variant_name', { length: 255 }).notNull(),
    metalId: uuid('metal_id').references(() => metals.id),
    purityId: uuid('purity_id').references(() => purities.id),
    grossWeight: numeric('gross_weight', { precision: 12, scale: 4 }).default('0.0000').notNull(),
    netWeight: numeric('net_weight', { precision: 12, scale: 4 }).default('0.0000').notNull(),
    stoneWeight: numeric('stone_weight', { precision: 12, scale: 4 }).default('0.0000').notNull(),
    makingChargeTypeId: uuid('making_charge_type_id'),
    makingChargeValue: numeric('making_charge_value', { precision: 12, scale: 2 }).default('0.00').notNull(),
    wastageTypeId: uuid('wastage_type_id'),
    wastagePercentage: numeric('wastage_percentage', { precision: 5, scale: 2 }).default('0.00').notNull(),
    status: varchar('status', { length: 20 }).default('ACTIVE').notNull(), // ACTIVE | INACTIVE
    recordVersion: integer('record_version').default(1).notNull(),
    attributes: jsonb('attributes').default({}),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgSkuIdx: index('idx_product_variants_org_sku').on(table.organizationId, table.sku),
    templateIdx: index('idx_product_variants_template').on(table.templateId),
}));
