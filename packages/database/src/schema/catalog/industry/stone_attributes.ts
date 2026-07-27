import { pgTable, varchar, uuid, index } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const stoneAttributes = pgTable(
    'stone_attributes',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        type: varchar('type', { length: 50 }).notNull(), // COLOR | CUT | SHAPE | CLARITY | ORIGIN
        value: varchar('value', { length: 100 }).notNull(), // e.g. Round, Oval, VS1, D, India
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxType: index('idx_stone_attributes_type').on(table.type),
        idxCode: index('idx_stone_attributes_code').on(table.code),
    })
);

export type StoneAttribute = typeof stoneAttributes.$inferSelect;
export type NewStoneAttribute = typeof stoneAttributes.$inferInsert;
