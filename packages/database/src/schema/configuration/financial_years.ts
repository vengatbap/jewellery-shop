import { pgTable, varchar, uuid, index, date, boolean, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../shared/index';

export const financialYears = pgTable(
    'financial_years',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        startDate: date('start_date').notNull(),
        endDate: date('end_date').notNull(),
        status: varchar('status', { length: 20 }).notNull().default('FUTURE'), // ACTIVE | CLOSED | FUTURE
        sequence: integer('sequence').notNull().default(1),
        isCurrent: boolean('is_current').notNull().default(false),
        isLocked: boolean('is_locked').notNull().default(false),
        lockReason: text('lock_reason'),
        closedBy: uuid('closed_by'),
        closedAt: timestamp('closed_at', { withTimezone: true }),
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_financial_years_code').on(table.code),
        idxOrg: index('idx_financial_years_org').on(table.organizationId),
    })
);

export type FinancialYear = typeof financialYears.$inferSelect;
export type NewFinancialYear = typeof financialYears.$inferInsert;
