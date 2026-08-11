import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';
import { branches } from '../platform/branches';

export const stockAdjustments = pgTable('stock_adjustments', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    adjustmentNumber: varchar('adjustment_number', { length: 50 }).notNull(),
    reason: text('reason').notNull(),
    status: varchar('status', { length: 20 }).default('COMPLETED').notNull(),
    createdBy: uuid('created_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgAdjustmentNoIdx: index('idx_stock_adjustments_org_no').on(table.organizationId, table.adjustmentNumber),
    branchIdx: index('idx_stock_adjustments_branch').on(table.branchId),
}));
