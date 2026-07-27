import { pgTable, varchar, uuid, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const timezones = pgTable(
    'timezones',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        offset: varchar('offset', { length: 10 }).notNull(), // e.g. +05:30, +03:00
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxName: uniqueIndex('idx_timezones_name_unique').on(table.name),
        idxCode: index('idx_timezones_code').on(table.code),
    })
);

export type Timezone = typeof timezones.$inferSelect;
export type NewTimezone = typeof timezones.$inferInsert;
