import { db } from '@auric-one/database';
import { metals } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';
import { QueryHelper, CatalogQueryParams } from './query.helper';

export class MetalRepository {
    async findById(id: string) {
        const results = await db
            .select()
            .from(metals)
            .where(eq(metals.id, id))
            .limit(1);
        return results[0] || null;
    }

    async findByCode(code: string) {
        const results = await db
            .select()
            .from(metals)
            .where(eq(metals.code, code))
            .limit(1);
        return results[0] || null;
    }

    async findMany(params: CatalogQueryParams) {
        const filters = QueryHelper.applyFilters(
            {
                isActive: metals.isActive,
                deletedAt: metals.deletedAt,
                code: metals.code,
                name: metals.name,
            },
            params
        );

        const { limit, offset } = QueryHelper.getPaginationOffset(params.page, params.limit);

        const query = db
            .select()
            .from(metals);

        if (filters) {
            query.where(filters);
        }

        query.limit(limit).offset(offset);

        if (params.sort) {
            const direction = params.sort.startsWith('-') ? 'desc' : 'asc';
            const cleanSort = params.sort.replace(/^-/, '');
            const column = metals[cleanSort as keyof typeof metals];
            if (column) {
                const sortExpr = QueryHelper.applySort(column as any, direction);
                if (sortExpr) {
                    query.orderBy(sortExpr);
                }
            }
        } else {
            query.orderBy(metals.displayOrder);
        }

        return query;
    }

    async count(params: CatalogQueryParams) {
        const filters = QueryHelper.applyFilters(
            {
                isActive: metals.isActive,
                deletedAt: metals.deletedAt,
                code: metals.code,
                name: metals.name,
            },
            params
        );

        const countQuery = db
            .select({ count: sql<number>`count(*)` })
            .from(metals);

        if (filters) {
            countQuery.where(filters);
        }

        const results = await countQuery;
        return Number(results[0]?.count || 0);
    }

    async create(data: typeof metals.$inferInsert) {
        const results = await db.insert(metals).values(data).returning();
        return results[0];
    }

    async update(id: string, data: Partial<typeof metals.$inferInsert>, expectedVersion: number) {
        const results = await db
            .update(metals)
            .set({
                ...data,
                recordVersion: sql`${metals.recordVersion} + 1`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(metals.id, id),
                    eq(metals.recordVersion, expectedVersion)
                )
            )
            .returning();
        return results[0] || null;
    }

    async delete(id: string) {
        const results = await db
            .update(metals)
            .set({
                deletedAt: new Date(),
                isActive: false
            })
            .where(eq(metals.id, id))
            .returning();
        return results[0] || null;
    }
}
