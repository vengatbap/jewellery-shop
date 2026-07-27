import { timestamp, uuid, varchar, text, integer, boolean } from 'drizzle-orm/pg-core';

export function timestamps() {
    return {
        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    };
}

export function softDelete() {
    return {
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
    };
}

export function tenantContext() {
    return {
        organizationId: uuid('organization_id').notNull(),
        branchId: uuid('branch_id'),
    };
}

export function businessColumns(codeLength: number = 20) {
    return {
        code: varchar('code', { length: codeLength }),
        status: varchar('status', { length: 50 }).notNull().default('ACTIVE'),
        remarks: text('remarks'),
    };
}

export function auditColumns() {
    return {
        createdBy: uuid('created_by'),
        updatedBy: uuid('updated_by'),
        deletedBy: uuid('deleted_by'),
    };
}

export function catalogColumns() {
    return {
        code: varchar('code', { length: 50 }).notNull(),
        name: varchar('name', { length: 100 }).notNull(),
        description: text('description'),
        displayOrder: integer('display_order').notNull().default(0),
        isActive: boolean('is_active').notNull().default(true),
        remarks: text('remarks'),
        schemaVersion: integer('schema_version').notNull().default(1),
        recordVersion: integer('record_version').notNull().default(1),
        effectiveFrom: timestamp('effective_from', { withTimezone: true }),
        effectiveTo: timestamp('effective_to', { withTimezone: true }),
    };
}
