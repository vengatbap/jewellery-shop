import { db } from '@auric-one/database';
import { purities } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';
import { QueryHelper, CatalogQueryParams } from './query.helper';

export class PurityRepository {
    async findById(id: string) {
        const results = await db
            .select()
            .from(purities)
            .where(eq(purities.id, id))
            .limit(1);
        return results[0] || null;
    }

    async findByCode(code: string) {
        const results = await db
            .select()
            .from(purities)
            .where(eq(purities.code, code))
            .limit(1);
        return results[0] || null;
    }

    async findMany(params: CatalogQueryParams) {
        const filters = QueryHelper.applyFilters(
            {
                isActive: purities.isActive,
                deletedAt: purities.deletedAt,
                code: purities.code,
                name: purities.name,
            },
            params
        );

        const { limit, offset } = QueryHelper.getPaginationOffset(params.page, params.limit);

        const query = db
            .select()
            .from(purities);

        if (filters) {
            query.where(filters);
        }

        query.limit(limit).offset(offset);

        if (params.sort) {
            const direction = params.sort.startsWith('-') ? 'desc' : 'asc';
            const cleanSort = params.sort.replace(/^-/, '');
            const column = purities[cleanSort as keyof typeof purities];
            if (column) {
                const sortExpr = QueryHelper.applySort(column as any, direction);
                if (sortExpr) {
                    query.orderBy(sortExpr);
                }
            }
        } else {
            query.orderBy(purities.displayOrder);
        }

        return query;
    }

    async count(params: CatalogQueryParams) {
        const filters = QueryHelper.applyFilters(
            {
                isActive: purities.isActive,
                deletedAt: purities.deletedAt,
                code: purities.code,
                name: purities.name,
            },
            params
        );

        const countQuery = db
            .select({ count: sql<number>`count(*)` })
            .from(purities);

        if (filters) {
            countQuery.where(filters);
        }

        const results = await countQuery;
        return Number(results[0]?.count || 0);
    }

    async create(data: typeof purities.$inferInsert) {
        const results = await db.insert(purities).values(data).returning();
        return results[0];
    }

    async update(id: string, data: Partial<typeof purities.$inferInsert>, expectedVersion: number) {
        const results = await db
            .update(purities)
            .set({
                ...data,
                recordVersion: sql`${purities.recordVersion} + 1`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(purities.id, id),
                    eq(purities.recordVersion, expectedVersion)
                )
            )
            .returning();
        return results[0] || null;
    }

    async delete(id: string) {
        const results = await db
            .update(purities)
            .set({
                deletedAt: new Date(),
                isActive: false
            })
            .where(eq(purities.id, id))
            .returning();
        return results[0] || null;
    }
}
