import { pgTable, varchar, uuid, index, date } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../shared/index';

export const calendarEvents = pgTable(
    'calendar_events',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        date: date('date').notNull(),
        type: varchar('type', { length: 20 }).notNull().default('HOLIDAY'), // HOLIDAY | FESTIVAL | STOCK_AUDIT | MAINTENANCE | RATE_FREEZE | FINANCIAL_CLOSE | CUSTOM
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_calendar_events_code').on(table.code),
        idxOrg: index('idx_calendar_events_org').on(table.organizationId),
        idxDate: index('idx_calendar_events_date').on(table.date),
    })
);

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;
