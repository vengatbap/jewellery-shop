import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { pawnLoans } from './pawn_loans.js';

export const pawnAuctions = pgTable('pawn_auctions', {
    id: uuid('id').defaultRandom().primaryKey(),
    loanId: uuid('loan_id').notNull().references(() => pawnLoans.id),
    auctionDate: timestamp('auction_date', { withTimezone: true }).defaultNow().notNull(),
    auctionedPrice: numeric('auctioned_price', { precision: 12, scale: 2 }).notNull(),
    surplusRefundToCustomer: numeric('surplus_refund_to_customer', { precision: 12, scale: 2 }).default('0.00').notNull(),
    status: varchar('status', { length: 20 }).default('COMPLETED').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    loanIdx: index('idx_pawn_auctions_loan').on(table.loanId),
}));
