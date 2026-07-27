import { pgTable, uuid, index, foreignKey } from 'drizzle-orm/pg-core';
import { timestamps, softDelete } from '../../shared/index';
import { metals } from './metals';
import { purities } from './purities';

export const metalPurityMapping = pgTable(
    'metal_purity_mapping',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        metalId: uuid('metal_id').notNull(),
        purityId: uuid('purity_id').notNull(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        fkMetal: foreignKey({
            columns: [table.metalId],
            foreignColumns: [metals.id],
        }).onDelete('cascade'),
        fkPurity: foreignKey({
            columns: [table.purityId],
            foreignColumns: [purities.id],
        }).onDelete('cascade'),
        idxMapping: index('idx_metal_purity_mapping').on(table.metalId, table.purityId),
    })
);

export type MetalPurityMapping = typeof metalPurityMapping.$inferSelect;
export type NewMetalPurityMapping = typeof metalPurityMapping.$inferInsert;
