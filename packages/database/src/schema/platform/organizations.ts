import {
    pgTable,
    text,
    varchar,
    smallint,
    uniqueIndex,
    index,
    uuid,
} from 'drizzle-orm/pg-core';
import {
    timestamps,
    softDelete,
    auditColumns,
    organizationStatusEnum,
} from '../shared/index';

export const organizations = pgTable(
    'organizations',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        businessId: varchar('business_id', { length: 20 }).notNull().unique(),
        name: varchar('name', { length: 255 }).notNull(),
        legalName: varchar('legal_name', { length: 255 }),
        registrationNumber: varchar('registration_number', { length: 100 }),
        taxNumber: varchar('tax_number', { length: 50 }),
        currency: varchar('currency', { length: 3 }).notNull().default('INR'),
        timezone: varchar('timezone', { length: 50 }).notNull().default('Asia/Kolkata'),
        logoUrl: text('logo_url'),
        email: varchar('email', { length: 255 }),
        phone: varchar('phone', { length: 20 }),
        website: text('website'),
        address: text('address'),
        city: varchar('city', { length: 100 }),
        state: varchar('state', { length: 100 }),
        country: varchar('country', { length: 2 }).default('IN'),
        fiscalYearStart: smallint('fiscal_year_start').default(1),
        invoicePrefix: varchar('invoice_prefix', { length: 10 }).default('INV'),
        status: organizationStatusEnum('status').notNull().default('ACTIVE'),
        ...timestamps(),
        ...softDelete(),
        ...auditColumns(),
    },
    (table) => ({
        idxStatus: index('idx_organizations_status').on(table.status),
        idxCreatedAt: index('idx_organizations_created_at').on(table.createdAt),
        uniqTaxNumber: uniqueIndex('uniq_organizations_tax_number').on(
            table.taxNumber,
            table.deletedAt
        ),
    })
);

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
