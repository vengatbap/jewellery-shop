import { db } from '@auric-one/database';
import { calendarEvents } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';

export class CalendarEventRepository {
    async findById(id: string, organizationId: string) {
        const results = await db
            .select()
            .from(calendarEvents)
            .where(and(eq(calendarEvents.id, id), eq(calendarEvents.organizationId, organizationId)))
            .limit(1);
        return results[0] || null;
    }

    async findMany(organizationId: string) {
        return db
            .select()
            .from(calendarEvents)
            .where(eq(calendarEvents.organizationId, organizationId))
            .orderBy(calendarEvents.date);
    }

    async create(data: typeof calendarEvents.$inferInsert) {
        const results = await db.insert(calendarEvents).values(data).returning();
        return results[0];
    }

    async update(id: string, organizationId: string, data: Partial<typeof calendarEvents.$inferInsert>, expectedVersion: number) {
        const results = await db
            .update(calendarEvents)
            .set({
                ...data,
                recordVersion: sql`${calendarEvents.recordVersion} + 1`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(calendarEvents.id, id),
                    eq(calendarEvents.organizationId, organizationId),
                    eq(calendarEvents.recordVersion, expectedVersion)
                )
            )
            .returning();
        return results[0] || null;
    }
}
