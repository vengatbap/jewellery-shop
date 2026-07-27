import { pgTable, varchar, uuid, index, date, boolean } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../../shared/index';

export const collections = pgTable(
    'collections',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        season: varchar('season', { length: 50 }),
        launchDate: date('launch_date'),
        retireDate: date('retire_date'),
        isFeatured: boolean('is_featured').notNull().default(false),
        bannerImage: varchar('banner_image', { length: 255 }),
        lifecycleStatus: varchar('lifecycle_status', { length: 20 }).notNull().default('DRAFT'), // DRAFT | ACTIVE | RETIRED | ARCHIVED
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_collections_code').on(table.code),
        idxOrg: index('idx_collections_org').on(table.organizationId),
    })
);

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
