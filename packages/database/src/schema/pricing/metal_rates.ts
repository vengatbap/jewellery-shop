import { pgTable, uuid, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { metals } from '../catalog/industry/metals.js';
import { purities } from '../catalog/industry/purities.js';

export const metalRates = pgTable('metal_rates', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    metalId: uuid('metal_id').notNull().references(() => metals.id),
    purityId: uuid('purity_id').notNull().references(() => purities.id),
    ratePerGram: numeric('rate_per_gram', { precision: 12, scale: 2 }).notNull(),
    effectiveAt: timestamp('effective_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: uuid('created_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgMetalPurityIdx: index('idx_metal_rates_org_metal_purity').on(table.organizationId, table.metalId, table.purityId),
    effectiveAtIdx: index('idx_metal_rates_effective_at').on(table.effectiveAt),
}));
