import { relations } from "drizzle-orm"

import { journalEntries } from "../schema/accounting/journal_entries.schema"
import { journalEntryLines } from "../schema/accounting/journal_entry_lines.schema"
import { accounts } from "../schema/accounting/accounts.schema"

export const journalEntriesRelations = relations(
  journalEntries,
  ({ many }) => ({
    lines: many(journalEntryLines)
  })
)

export const journalEntryLinesRelations = relations(
  journalEntryLines,
  ({ one }) => ({
    account: one(accounts, {
      fields: [journalEntryLines.accountId],
      references: [accounts.id]
    })
  })
)