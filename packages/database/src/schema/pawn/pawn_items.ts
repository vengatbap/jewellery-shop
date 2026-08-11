import { pgTable, uuid, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { pawnLoans } from './pawn_loans.js';
import { purities } from '../catalog/industry/purities.js';

export const pawnItems = pgTable('pawn_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    loanId: uuid('loan_id').notNull().references(() => pawnLoans.id, { onDelete: 'cascade' }),
    itemDescription: text('item_description').notNull(),
    grossWeightGrams: numeric('gross_weight_grams', { precision: 12, scale: 4 }).notNull(),
    netWeightGrams: numeric('net_weight_grams', { precision: 12, scale: 4 }).notNull(),
    purityId: uuid('purity_id').notNull().references(() => purities.id),
    appraisedValuePerGram: numeric('appraised_value_per_gram', { precision: 12, scale: 2 }).notNull(),
    totalAppraisedValue: numeric('total_appraised_value', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    loanIdx: index('idx_pawn_items_loan').on(table.loanId),
}));
