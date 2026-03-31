import { pgTable, uuid, text, date, timestamp } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"

export const journalEntries = pgTable("journal_entries", {

  id: primaryId,

  entryNumber: text("entry_number"),

  entryDate: date("entry_date"),

  description: text("description"),

  createdBy: uuid("created_by"),

  createdAt: timestamp("created_at").defaultNow()

})