import { pgTable, varchar, uuid, index, foreignKey } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../../shared/index';

export const productCategories = pgTable(
    'product_categories',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        parentId: uuid('parent_id'),
        taxonomyLevel: varchar('taxonomy_level', { length: 20 }).notNull().default('CATEGORY'), // CATEGORY | SUBCATEGORY | FAMILY | TYPE | TEMPLATE
        image: varchar('image', { length: 255 }),
        icon: varchar('icon', { length: 50 }),
        barcodePrefix: varchar('barcode_prefix', { length: 5 }),
        defaultMakingChargeType: varchar('default_making_charge_type', { length: 20 }),
        defaultWastageType: varchar('default_wastage_type', { length: 20 }),
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkParent: foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
        }).onDelete('restrict'),
        idxCode: index('idx_product_categories_code').on(table.code),
        idxOrg: index('idx_product_categories_org').on(table.organizationId),
    })
);

export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;
