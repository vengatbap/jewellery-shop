import { pgTable, varchar, uuid, index, foreignKey } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../../shared/index';
import { productCategories } from './product_categories';

export const attributes = pgTable(
    'attributes',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        validationType: varchar('validation_type', { length: 20 }).notNull().default('TEXT'), // TEXT | NUMBER | BOOLEAN | DATE | LIST | REGEX
        validationRule: varchar('validation_rule', { length: 255 }),
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_attributes_code').on(table.code),
        idxOrg: index('idx_attributes_org').on(table.organizationId),
    })
);

export const attributeValues = pgTable(
    'attribute_values',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        attributeId: uuid('attribute_id').notNull(),
        value: varchar('value', { length: 255 }).notNull(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkAttribute: foreignKey({
            columns: [table.attributeId],
            foreignColumns: [attributes.id],
        }).onDelete('cascade'),
        idxCode: index('idx_attribute_values_code').on(table.code),
    })
);

export const categoryAttributeMapping = pgTable(
    'category_attribute_mapping',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        categoryId: uuid('category_id').notNull(),
        attributeId: uuid('attribute_id').notNull(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkCategory: foreignKey({
            columns: [table.categoryId],
            foreignColumns: [productCategories.id],
        }).onDelete('cascade'),
        fkAttribute: foreignKey({
            columns: [table.attributeId],
            foreignColumns: [attributes.id],
        }).onDelete('cascade'),
        idxMapping: index('idx_cat_attr_mapping').on(table.categoryId, table.attributeId),
    })
);

export type Attribute = typeof attributes.$inferSelect;
export type NewAttribute = typeof attributes.$inferInsert;

export type AttributeValue = typeof attributeValues.$inferSelect;
export type NewAttributeValue = typeof attributeValues.$inferInsert;

export type CategoryAttributeMapping = typeof categoryAttributeMapping.$inferSelect;
export type NewCategoryAttributeMapping = typeof categoryAttributeMapping.$inferInsert;
