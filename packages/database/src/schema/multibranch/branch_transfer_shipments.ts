import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';

export const branchTransferShipments = pgTable('branch_transfer_shipments', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    sourceBranchId: uuid('source_branch_id').notNull().references(() => branches.id),
    destinationBranchId: uuid('destination_branch_id').notNull().references(() => branches.id),
    transferNumber: varchar('transfer_number', { length: 50 }).notNull(),
    status: varchar('status', { length: 20 }).default('PENDING').notNull(), // PENDING | IN_TRANSIT | COMPLETED | CANCELLED
    shippedBy: uuid('shipped_by'),
    receivedBy: uuid('received_by'),
    shippedAt: timestamp('shipped_at', { withTimezone: true }),
    receivedAt: timestamp('received_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgTransferNoIdx: index('idx_branch_transfers_org_no').on(table.organizationId, table.transferNumber),
    sourceBranchIdx: index('idx_branch_transfers_source').on(table.sourceBranchId),
    destBranchIdx: index('idx_branch_transfers_dest').on(table.destinationBranchId),
}));
