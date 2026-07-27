import { db } from '@auric-one/database';
import { brands } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';
import { QueryHelper, CatalogQueryParams } from './query.helper';

export class BrandRepository {
    async findById(id: string, organizationId: string) {
        const results = await db
            .select()
            .from(brands)
            .where(
                and(
                    eq(brands.id, id),
                    eq(brands.organizationId, organizationId)
                )
            )
            .limit(1);
        return results[0] || null;
    }

    async findByCode(code: string, organizationId: string) {
        const results = await db
            .select()
            .from(brands)
            .where(
                and(
                    eq(brands.code, code),
                    eq(brands.organizationId, organizationId)
                )
            )
            .limit(1);
        return results[0] || null;
    }

    async findMany(params: CatalogQueryParams, organizationId: string) {
        const filters = QueryHelper.applyFilters(
            {
                organizationId: brands.organizationId,
                isActive: brands.isActive,
                deletedAt: brands.deletedAt,
                code: brands.code,
                name: brands.name,
            },
            params,
            { organizationId }
        );

        const { limit, offset } = QueryHelper.getPaginationOffset(params.page, params.limit);

        const query = db
            .select()
            .from(brands);

        if (filters) {
            query.where(filters);
        }

        query.limit(limit).offset(offset);

        if (params.sort) {
            const direction = params.sort.startsWith('-') ? 'desc' : 'asc';
            const cleanSort = params.sort.replace(/^-/, '');
            const column = brands[cleanSort as keyof typeof brands];
            if (column) {
                const sortExpr = QueryHelper.applySort(column as any, direction);
                if (sortExpr) {
                    query.orderBy(sortExpr);
                }
            }
        } else {
            query.orderBy(brands.displayOrder);
        }

        return query;
    }

    async count(params: CatalogQueryParams, organizationId: string) {
        const filters = QueryHelper.applyFilters(
            {
                organizationId: brands.organizationId,
                isActive: brands.isActive,
                deletedAt: brands.deletedAt,
                code: brands.code,
                name: brands.name,
            },
            params,
            { organizationId }
        );

        const countQuery = db
            .select({ count: sql<number>`count(*)` })
            .from(brands);

        if (filters) {
            countQuery.where(filters);
        }

        const results = await countQuery;
        return Number(results[0]?.count || 0);
    }

    async create(data: typeof brands.$inferInsert) {
        const results = await db.insert(brands).values(data).returning();
        return results[0];
    }

    async update(id: string, organizationId: string, data: Partial<typeof brands.$inferInsert>, expectedVersion: number) {
        const results = await db
            .update(brands)
            .set({
                ...data,
                recordVersion: sql`${brands.recordVersion} + 1`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(brands.id, id),
                    eq(brands.organizationId, organizationId),
                    eq(brands.recordVersion, expectedVersion)
                )
            )
            .returning();
        return results[0] || null;
    }

    async delete(id: string, organizationId: string) {
        const results = await db
            .update(brands)
            .set({
                deletedAt: new Date(),
                isActive: false
            })
            .where(
                and(
                    eq(brands.id, id),
                    eq(brands.organizationId, organizationId)
                )
            )
            .returning();
        return results[0] || null;
    }
}
