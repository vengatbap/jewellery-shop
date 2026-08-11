import { pgTable, uuid, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { customerProfiles } from './customer_profiles';
import { invoices } from '../pos/invoices';

export const customerLoyaltyTransactions = pgTable('customer_loyalty_transactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    customerId: uuid('customer_id').notNull().references(() => customerProfiles.id, { onDelete: 'cascade' }),
    invoiceId: uuid('invoice_id').references(() => invoices.id),
    pointsEarned: integer('points_earned').default(0).notNull(),
    pointsRedeemed: integer('points_redeemed').default(0).notNull(),
    balanceAfter: integer('balance_after').notNull(),
    description: varchar('description', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    customerIdx: index('idx_customer_loyalty_customer').on(table.customerId),
}));
