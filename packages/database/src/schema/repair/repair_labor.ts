import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { repairJobCards } from './repair_job_cards.js';

export const repairLabor = pgTable('repair_labor', {
    id: uuid('id').defaultRandom().primaryKey(),
    jobId: uuid('job_id').notNull().references(() => repairJobCards.id, { onDelete: 'cascade' }),
    laborDescription: varchar('labor_description', { length: 255 }).notNull(),
    laborCost: numeric('labor_cost', { precision: 12, scale: 2 }).default('0.00').notNull(),
    materialsCost: numeric('materials_cost', { precision: 12, scale: 2 }).default('0.00').notNull(),
    totalCharge: numeric('total_charge', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    jobIdx: index('idx_repair_labor_job').on(table.jobId),
}));
