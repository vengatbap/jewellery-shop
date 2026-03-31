import { pgTable, uuid, text, date, timestamp } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"

export const stockTransfers = pgTable("stock_transfers", {

  id: primaryId,

  fromBranch: uuid("from_branch"),

  toBranch: uuid("to_branch"),

  transferNumber: text("transfer_number"),

  transferDate: date("transfer_date"),

  status: text("status"),

  createdBy: uuid("created_by"),

  createdAt: timestamp("created_at").defaultNow()

})