import { pgTable, uuid, numeric } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"

export const journalEntryLines = pgTable("journal_entry_lines", {
  id: primaryId,

  journalEntryId: uuid("journal_entry_id"),

  accountId: uuid("account_id"),

  debit: numeric("debit"),

  credit: numeric("credit")
})