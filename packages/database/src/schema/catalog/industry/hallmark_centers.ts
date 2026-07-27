import { pgTable, varchar, uuid, index, foreignKey } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';
import { countries } from '../global/countries';

export const hallmarkCenters = pgTable(
    'hallmark_centers',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        countryId: uuid('country_id').notNull(),
        city: varchar('city', { length: 100 }).notNull(),
        licenseNumber: varchar('license_number', { length: 100 }).notNull(),
        website: varchar('website', { length: 255 }),
        email: varchar('email', { length: 100 }),
        phone: varchar('phone', { length: 50 }),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkCountry: foreignKey({
            columns: [table.countryId],
            foreignColumns: [countries.id],
        }).onDelete('restrict'),
        idxCode: index('idx_hallmark_centers_code').on(table.code),
    })
);

export type HallmarkCenter = typeof hallmarkCenters.$inferSelect;
export type NewHallmarkCenter = typeof hallmarkCenters.$inferInsert;
