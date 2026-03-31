import { pgTable, uuid } from "drizzle-orm/pg-core"
import { primaryId } from "../shared/common"
import { stockTransfers } from "./stock_transfers.schema"

export const stockTransferItems = pgTable("stock_transfer_items", {

  id: primaryId,

  transferId: uuid("transfer_id")
    .references(() => stockTransfers.id),

  inventoryItemId: uuid("inventory_item_id")

})