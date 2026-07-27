import { db } from '@auric-one/database';
import { financialYears } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';

export class FinancialYearRepository {
    async findById(id: string, organizationId: string) {
        const results = await db
            .select()
            .from(financialYears)
            .where(and(eq(financialYears.id, id), eq(financialYears.organizationId, organizationId)))
            .limit(1);
        return results[0] || null;
    }

    async findMany(organizationId: string) {
        return db
            .select()
            .from(financialYears)
            .where(eq(financialYears.organizationId, organizationId))
            .orderBy(financialYears.sequence);
    }

    async create(data: typeof financialYears.$inferInsert) {
        const results = await db.insert(financialYears).values(data).returning();
        return results[0];
    }

    async update(id: string, organizationId: string, data: Partial<typeof financialYears.$inferInsert>, expectedVersion: number) {
        const results = await db
            .update(financialYears)
            .set({
                ...data,
                recordVersion: sql`${financialYears.recordVersion} + 1`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(financialYears.id, id),
                    eq(financialYears.organizationId, organizationId),
                    eq(financialYears.recordVersion, expectedVersion)
                )
            )
            .returning();
        return results[0] || null;
    }
}
