import { pgTable, varchar, uuid, index } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const diamondLabs = pgTable(
    'diamond_labs',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        website: varchar('website', { length: 255 }),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_diamond_labs_code').on(table.code),
    })
);

export type DiamondLab = typeof diamondLabs.$inferSelect;
export type NewDiamondLab = typeof diamondLabs.$inferInsert;
