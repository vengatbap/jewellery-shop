import { db } from '@auric-one/database';
import { paymentMethods } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';

export class PaymentMethodRepository {
    async findById(id: string, organizationId: string) {
        const results = await db
            .select()
            .from(paymentMethods)
            .where(and(eq(paymentMethods.id, id), eq(paymentMethods.organizationId, organizationId)))
            .limit(1);
        return results[0] || null;
    }

    async findMany(organizationId: string) {
        return db
            .select()
            .from(paymentMethods)
            .where(eq(paymentMethods.organizationId, organizationId))
            .orderBy(paymentMethods.displayOrder);
    }

    async create(data: typeof paymentMethods.$inferInsert) {
        const results = await db.insert(paymentMethods).values(data).returning();
        return results[0];
    }

    async update(id: string, organizationId: string, data: Partial<typeof paymentMethods.$inferInsert>, expectedVersion: number) {
        const results = await db
            .update(paymentMethods)
            .set({
                ...data,
                recordVersion: sql`${paymentMethods.recordVersion} + 1`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(paymentMethods.id, id),
                    eq(paymentMethods.organizationId, organizationId),
                    eq(paymentMethods.recordVersion, expectedVersion)
                )
            )
            .returning();
        return results[0] || null;
    }
}
