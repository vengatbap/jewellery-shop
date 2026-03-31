import { relations } from "drizzle-orm"

import { metals } from "../schema/metals/metals.schema"
import { metalPurity } from "../schema/metals/metal_purity.schema"
import { metalRates } from "../schema/metals/metal_rates.schema"

export const metalsRelations = relations(
  metals,
  ({ many }) => ({
    purityLevels: many(metalPurity),
    rates: many(metalRates)
  })
)