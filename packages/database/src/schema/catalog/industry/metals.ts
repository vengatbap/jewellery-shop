import { pgTable, varchar, uuid, index, boolean, integer, decimal } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, catalogColumns } from '../../shared/index';

export const metals = pgTable(
    'metals',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        symbol: varchar('symbol', { length: 10 }).notNull(),
        atomicNumber: integer('atomic_number'),
        marketCode: varchar('market_code', { length: 20 }), // e.g. XAU, XAG
        defaultPurityId: uuid('default_purity_id'),
        supportsHallmark: boolean('supports_hallmark').notNull().default(true),
        supportsStone: boolean('supports_stone').notNull().default(true),
        supportsExchange: boolean('supports_exchange').notNull().default(true),
        supportsBuyback: boolean('supports_buyback').notNull().default(true),
        supportsInvestment: boolean('supports_investment').notNull().default(false),
        supportsScrap: boolean('supports_scrap').notNull().default(true),
        supportsCertification: boolean('supports_certification').notNull().default(true),
        density: decimal('density', { precision: 6, scale: 3 }), // e.g. 19.32 for gold
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_metals_code').on(table.code),
    })
);

export type Metal = typeof metals.$inferSelect;
export type NewMetal = typeof metals.$inferInsert;
