import { pgTable, varchar, uuid, index } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../../shared/index';

export const brands = pgTable(
    'brands',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        manufacturer: varchar('manufacturer', { length: 100 }),
        country: varchar('country', { length: 2 }), // ISO-2 country code
        website: varchar('website', { length: 255 }),
        logo: varchar('logo', { length: 255 }),
        brandType: varchar('brand_type', { length: 20 }).notNull().default('INTERNAL'), // INTERNAL | VENDOR | DESIGNER | OEM
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_brands_code').on(table.code),
        idxOrg: index('idx_brands_org').on(table.organizationId),
    })
);

export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
