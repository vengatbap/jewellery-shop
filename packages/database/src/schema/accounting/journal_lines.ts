import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { journalEntries } from './journal_entries.js';
import { chartOfAccounts } from './chart_of_accounts.js';

export const journalLines = pgTable('journal_lines', {
    id: uuid('id').defaultRandom().primaryKey(),
    journalId: uuid('journal_id').notNull().references(() => journalEntries.id, { onDelete: 'cascade' }),
    accountId: uuid('account_id').notNull().references(() => chartOfAccounts.id),
    debitAmount: numeric('debit_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    creditAmount: numeric('credit_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    memo: varchar('memo', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    journalIdx: index('idx_journal_lines_journal').on(table.journalId),
    accountIdx: index('idx_journal_lines_account').on(table.accountId),
}));
