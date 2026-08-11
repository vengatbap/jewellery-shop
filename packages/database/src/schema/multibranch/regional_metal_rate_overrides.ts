import { pgTable, uuid, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';
import { metals } from '../catalog/industry/metals.js';
import { purities } from '../catalog/industry/purities.js';

export const regionalMetalRateOverrides = pgTable('regional_metal_rate_overrides', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    metalId: uuid('metal_id').notNull().references(() => metals.id),
    purityId: uuid('purity_id').notNull().references(() => purities.id),
    rateOffsetAmount: numeric('rate_offset_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    effectiveAt: timestamp('effective_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgBranchMetalPurityIdx: index('idx_regional_metal_rates_org_branch').on(table.organizationId, table.branchId, table.metalId, table.purityId),
}));
