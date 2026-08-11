import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations';
import { branches } from '../platform/branches';

export const quotations = pgTable('quotations', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    quotationNumber: varchar('quotation_number', { length: 50 }).notNull(),
    customerId: uuid('customer_id'),
    grandTotal: numeric('grand_total', { precision: 12, scale: 2 }).notNull(),
    validUntil: timestamp('valid_until', { withTimezone: true }).notNull(),
    status: varchar('status', { length: 20 }).default('ACTIVE').notNull(), // ACTIVE | EXPIRED | CONVERTED
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgQuotationNoIdx: index('idx_quotations_org_no').on(table.organizationId, table.quotationNumber),
}));
