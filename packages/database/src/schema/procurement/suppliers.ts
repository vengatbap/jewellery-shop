import { pgTable, uuid, varchar, text, numeric, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';

export const suppliers = pgTable('suppliers', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    supplierCode: varchar('supplier_code', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    contactPerson: varchar('contact_person', { length: 255 }),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    taxId: varchar('tax_id', { length: 100 }),
    address: text('address'),
    status: varchar('status', { length: 20 }).default('ACTIVE').notNull(), // ACTIVE | INACTIVE
    balance: numeric('balance', { precision: 12, scale: 2 }).default('0.00').notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgSupplierCodeIdx: index('idx_suppliers_org_code').on(table.organizationId, table.supplierCode),
    orgNameIdx: index('idx_suppliers_org_name').on(table.organizationId, table.name),
}));
