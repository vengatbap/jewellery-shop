import {
    pgTable,
    varchar,
    text,
    index,
} from 'drizzle-orm/pg-core';
import { primaryId } from '../shared/common';
import { timestamps } from '../shared/index';

export const permissions = pgTable(
    'permissions',
    {
        id: primaryId,
        code: varchar('code', { length: 100 }).notNull().unique(),
        module: varchar('module', { length: 50 }).notNull(),
        name: varchar('name', { length: 255 }).notNull(),
        description: text('description'),
        ...timestamps(),
    },
    (table) => ({
        idxModule: index('idx_permissions_module').on(table.module),
    })
);

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
