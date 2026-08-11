import { pgTable, uuid, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { customerSchemes } from './customer_schemes.js';
import { invoices } from '../pos/invoices.js';

export const schemeRedemptions = pgTable('scheme_redemptions', {
    id: uuid('id').defaultRandom().primaryKey(),
    schemeAccountId: uuid('scheme_account_id').notNull().references(() => customerSchemes.id),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id),
    redemptionDate: timestamp('redemption_date', { withTimezone: true }).defaultNow().notNull(),
    redeemedAmount: numeric('redeemed_amount', { precision: 12, scale: 2 }).notNull(),
    redeemedWeightGrams: numeric('redeemed_weight_grams', { precision: 12, scale: 4 }).default('0.0000').notNull(),
    bonusRedeemedAmount: numeric('bonus_redeemed_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    schemeAccountIdx: index('idx_scheme_redemptions_account').on(table.schemeAccountId),
    invoiceIdx: index('idx_scheme_redemptions_invoice').on(table.invoiceId),
}));
