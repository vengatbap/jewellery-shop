import { db } from '@auric-one/database';
import { collections } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';
import { QueryHelper, CatalogQueryParams } from './query.helper';

export class CollectionRepository {
    async findById(id: string, organizationId: string) {
        const results = await db
            .select()
            .from(collections)
            .where(
                and(
                    eq(collections.id, id),
                    eq(collections.organizationId, organizationId)
                )
            )
            .limit(1);
        return results[0] || null;
    }

    async findByCode(code: string, organizationId: string) {
        const results = await db
            .select()
            .from(collections)
            .where(
                and(
                    eq(collections.code, code),
                    eq(collections.organizationId, organizationId)
                )
            )
            .limit(1);
        return results[0] || null;
    }

    async findMany(params: CatalogQueryParams, organizationId: string) {
        const filters = QueryHelper.applyFilters(
            {
                organizationId: collections.organizationId,
                isActive: collections.isActive,
                deletedAt: collections.deletedAt,
                code: collections.code,
                name: collections.name,
            },
            params,
            { organizationId }
        );

        const { limit, offset } = QueryHelper.getPaginationOffset(params.page, params.limit);

        const query = db
            .select()
            .from(collections);

        if (filters) {
            query.where(filters);
        }

        query.limit(limit).offset(offset);

        if (params.sort) {
            const direction = params.sort.startsWith('-') ? 'desc' : 'asc';
            const cleanSort = params.sort.replace(/^-/, '');
            const column = collections[cleanSort as keyof typeof collections];
            if (column) {
                const sortExpr = QueryHelper.applySort(column as any, direction);
                if (sortExpr) {
                    query.orderBy(sortExpr);
                }
            }
        } else {
            query.orderBy(collections.displayOrder);
        }

        return query;
    }

    async count(params: CatalogQueryParams, organizationId: string) {
        const filters = QueryHelper.applyFilters(
            {
                organizationId: collections.organizationId,
                isActive: collections.isActive,
                deletedAt: collections.deletedAt,
                code: collections.code,
                name: collections.name,
            },
            params,
            { organizationId }
        );

        const countQuery = db
            .select({ count: sql<number>`count(*)` })
            .from(collections);

        if (filters) {
            countQuery.where(filters);
        }

        const results = await countQuery;
        return Number(results[0]?.count || 0);
    }

    async create(data: typeof collections.$inferInsert) {
        const results = await db.insert(collections).values(data).returning();
        return results[0];
    }

    async update(id: string, organizationId: string, data: Partial<typeof collections.$inferInsert>, expectedVersion: number) {
        const results = await db
            .update(collections)
            .set({
                ...data,
                recordVersion: sql`${collections.recordVersion} + 1`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(collections.id, id),
                    eq(collections.organizationId, organizationId),
                    eq(collections.recordVersion, expectedVersion)
                )
            )
            .returning();
        return results[0] || null;
    }

    async delete(id: string, organizationId: string) {
        const results = await db
            .update(collections)
            .set({
                deletedAt: new Date(),
                isActive: false
            })
            .where(
                and(
                    eq(collections.id, id),
                    eq(collections.organizationId, organizationId)
                )
            )
            .returning();
        return results[0] || null;
    }
}
