import { pgTable, uuid, varchar, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { organizations } from '../platform/organizations.js';
import { branches } from '../platform/branches.js';
import { customerProfiles } from '../crm/customer_profiles.js';

export const repairJobCards = pgTable('repair_job_cards', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id').notNull().references(() => branches.id),
    customerId: uuid('customer_id').references(() => customerProfiles.id),
    jobNumber: varchar('job_number', { length: 50 }).notNull(),
    artisanId: uuid('artisan_id'),
    intakeDate: timestamp('intake_date', { withTimezone: true }).defaultNow().notNull(),
    promisedDeliveryDate: timestamp('promised_delivery_date', { withTimezone: true }),
    status: varchar('status', { length: 30 }).default('INTAKE').notNull(), // INTAKE | IN_PROGRESS | READY | DELIVERED | CANCELLED
    totalEstimatedCost: numeric('total_estimated_cost', { precision: 12, scale: 2 }).default('0.00').notNull(),
    advancePaid: numeric('advance_paid', { precision: 12, scale: 2 }).default('0.00').notNull(),
    finalCost: numeric('final_cost', { precision: 12, scale: 2 }).default('0.00').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    orgJobNoIdx: index('idx_repair_jobs_org_no').on(table.organizationId, table.jobNumber),
    branchIdx: index('idx_repair_jobs_branch').on(table.branchId),
    customerIdx: index('idx_repair_jobs_customer').on(table.customerId),
}));
