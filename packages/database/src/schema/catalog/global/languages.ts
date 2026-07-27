import { pgTable, varchar, uuid, index } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const languages = pgTable(
    'languages',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        nativeName: varchar('native_name', { length: 100 }).notNull(),
        direction: varchar('direction', { length: 3 }).notNull().default('LTR'), // LTR | RTL
        locale: varchar('locale', { length: 10 }).notNull(), // e.g. ar-BH, en-US
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_languages_code').on(table.code),
    })
);

export type Language = typeof languages.$inferSelect;
export type NewLanguage = typeof languages.$inferInsert;
