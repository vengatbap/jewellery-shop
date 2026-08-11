import { pgTable, uuid, varchar, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';

export const journalEntries = pgTable('journal_entries', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    journalNumber: varchar('journal_number', { length: 50 }).notNull(),
    entryDate: timestamp('entry_date', { withTimezone: true }).defaultNow().notNull(),
    status: varchar('status', { length: 20 }).default('DRAFT').notNull(), // DRAFT | POSTED | VOID
    narrative: text('narrative'),
    totalDebit: numeric('total_debit', { precision: 12, scale: 2 }).default('0.00').notNull(),
    totalCredit: numeric('total_credit', { precision: 12, scale: 2 }).default('0.00').notNull(),
    postedAt: timestamp('posted_at', { withTimezone: true }),
    postedBy: uuid('posted_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgJournalNoIdx: index('idx_journal_entries_org_no').on(table.organizationId, table.journalNumber),
    branchIdx: index('idx_journal_entries_branch').on(table.branchId),
}));
