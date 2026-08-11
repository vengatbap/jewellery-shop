import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';
import { branches } from '../platform/branches';

export const stockTransfers = pgTable('stock_transfers', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    transferNumber: varchar('transfer_number', { length: 50 }).notNull(),
    fromBranchId: uuid('from_branch_id').notNull().references(() => branches.id),
    toBranchId: uuid('to_branch_id').notNull().references(() => branches.id),
    status: varchar('status', { length: 30 }).default('PENDING').notNull(), // PENDING | IN_TRANSIT | RECEIVED | CANCELLED
    notes: text('notes'),
    dispatchedAt: timestamp('dispatched_at', { withTimezone: true }),
    receivedAt: timestamp('received_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgTransferNoIdx: index('idx_stock_transfers_org_no').on(table.organizationId, table.transferNumber),
    fromBranchIdx: index('idx_stock_transfers_from_branch').on(table.fromBranchId),
    toBranchIdx: index('idx_stock_transfers_to_branch').on(table.toBranchId),
}));
