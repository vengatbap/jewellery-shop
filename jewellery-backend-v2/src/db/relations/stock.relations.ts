import { relations } from "drizzle-orm"

import { stockTransfers } from "../schema/stock/stock_transfers.schema"
import { stockTransferItems } from "../schema/stock/stock_transfer_items.schema"
import { stockMovements } from "../schema/stock/stock_movements.schema"

export const stockTransfersRelations = relations(
  stockTransfers,
  ({ many }) => ({
    items: many(stockTransferItems)
  })
)