import { db } from '@auric-one/database';
import { taxRules } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';

export class TaxRuleRepository {
    async findById(id: string, organizationId: string) {
        const results = await db
            .select()
            .from(taxRules)
            .where(and(eq(taxRules.id, id), eq(taxRules.organizationId, organizationId)))
            .limit(1);
        return results[0] || null;
    }

    async findMany(organizationId: string) {
        return db
            .select()
            .from(taxRules)
            .where(eq(taxRules.organizationId, organizationId))
            .orderBy(taxRules.priority);
    }

    async create(data: typeof taxRules.$inferInsert) {
        const results = await db.insert(taxRules).values(data).returning();
        return results[0];
    }

    async update(id: string, organizationId: string, data: Partial<typeof taxRules.$inferInsert>, expectedVersion: number) {
        const results = await db
            .update(taxRules)
            .set({
                ...data,
                recordVersion: sql`${taxRules.recordVersion} + 1`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(taxRules.id, id),
                    eq(taxRules.organizationId, organizationId),
                    eq(taxRules.recordVersion, expectedVersion)
                )
            )
            .returning();
        return results[0] || null;
    }
}
