import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';

export const invoices = pgTable('invoices', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
    customerId: uuid('customer_id'),
    cashierId: uuid('cashier_id'),
    totalMetalValue: numeric('total_metal_value', { precision: 12, scale: 2 }).default('0.00').notNull(),
    totalStoneValue: numeric('total_stone_value', { precision: 12, scale: 2 }).default('0.00').notNull(),
    totalMakingCharge: numeric('total_making_charge', { precision: 12, scale: 2 }).default('0.00').notNull(),
    totalWastageValue: numeric('total_wastage_value', { precision: 12, scale: 2 }).default('0.00').notNull(),
    discountAmount: numeric('discount_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    taxAmount: numeric('tax_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
    grandTotal: numeric('grand_total', { precision: 12, scale: 2 }).notNull(),
    status: varchar('status', { length: 20 }).default('COMPLETED').notNull(), // DRAFT | COMPLETED | CANCELLED | REFUNDED
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgInvoiceNoIdx: index('idx_invoices_org_no').on(table.organizationId, table.invoiceNumber),
    branchIdx: index('idx_invoices_branch').on(table.branchId),
    customerIdx: index('idx_invoices_customer').on(table.customerId),
}));
