import { pgTable, uuid, varchar, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { repairJobCards } from './repair_job_cards.js';

export const repairItems = pgTable('repair_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    jobId: uuid('job_id').notNull().references(() => repairJobCards.id, { onDelete: 'cascade' }),
    itemDescription: text('item_description').notNull(),
    grossWeightGrams: numeric('gross_weight_grams', { precision: 12, scale: 4 }).notNull(),
    netWeightGrams: numeric('net_weight_grams', { precision: 12, scale: 4 }).notNull(),
    metalId: uuid('metal_id'),
    purityId: uuid('purity_id'),
    problemDescription: text('problem_description').notNull(),
    serviceType: varchar('service_type', { length: 50 }).notNull(), // POLISHING | RESIZING | STONE_SETTING | SOLDERING | ENGRAVING
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    jobIdx: index('idx_repair_items_job').on(table.jobId),
}));
