import { pgTable, varchar, uuid, boolean, foreignKey, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';
import { currencies } from './currencies';
import { timezones } from './timezones';

export const countries = pgTable(
    'countries',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        continent: varchar('continent', { length: 50 }),
        region: varchar('region', { length: 50 }),
        iso3: varchar('iso3', { length: 3 }), // ISO-3 (e.g. IND, BHR)
        numericCode: varchar('numeric_code', { length: 3 }), // e.g. 048, 356
        phoneCode: varchar('phone_code', { length: 10 }), // e.g. +91, +973
        defaultCurrencyId: uuid('default_currency_id'),
        defaultTimezoneId: uuid('default_timezone_id'),
        flagEmoji: varchar('flag_emoji', { length: 10 }),
        nationality: varchar('nationality', { length: 100 }),
        isSupported: boolean('is_supported').notNull().default(true),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkCurrency: foreignKey({
            columns: [table.defaultCurrencyId],
            foreignColumns: [currencies.id],
        }).onDelete('set null'),
        fkTimezone: foreignKey({
            columns: [table.defaultTimezoneId],
            foreignColumns: [timezones.id],
        }).onDelete('set null'),
        idxCode: uniqueIndex('idx_countries_code_unique').on(table.code),
    })
);

export type Country = typeof countries.$inferSelect;
export type NewCountry = typeof countries.$inferInsert;
