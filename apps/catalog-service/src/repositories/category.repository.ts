import { db } from '@auric-one/database';
import { productCategories } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';
import { QueryHelper, CatalogQueryParams } from './query.helper';

export class CategoryRepository {
    async findById(id: string, organizationId: string) {
        const results = await db
            .select()
            .from(productCategories)
            .where(
                and(
                    eq(productCategories.id, id),
                    eq(productCategories.organizationId, organizationId)
                )
            )
            .limit(1);
        return results[0] || null;
    }

    async findByCode(code: string, organizationId: string) {
        const results = await db
            .select()
            .from(productCategories)
            .where(
                and(
                    eq(productCategories.code, code),
                    eq(productCategories.organizationId, organizationId)
                )
            )
            .limit(1);
        return results[0] || null;
    }

    async findMany(params: CatalogQueryParams, organizationId: string) {
        const filters = QueryHelper.applyFilters(
            {
                organizationId: productCategories.organizationId,
                isActive: productCategories.isActive,
                deletedAt: productCategories.deletedAt,
                code: productCategories.code,
                name: productCategories.name,
            },
            params,
            { organizationId }
        );

        const { limit, offset } = QueryHelper.getPaginationOffset(params.page, params.limit);

        const query = db
            .select()
            .from(productCategories);

        if (filters) {
            query.where(filters);
        }

        query.limit(limit).offset(offset);

        if (params.sort) {
            const direction = params.sort.startsWith('-') ? 'desc' : 'asc';
            const cleanSort = params.sort.replace(/^-/, '');
            const column = productCategories[cleanSort as keyof typeof productCategories];
            if (column) {
                const sortExpr = QueryHelper.applySort(column as any, direction);
                if (sortExpr) {
                    query.orderBy(sortExpr);
                }
            }
        } else {
            query.orderBy(productCategories.displayOrder);
        }

        return query;
    }

    async count(params: CatalogQueryParams, organizationId: string) {
        const filters = QueryHelper.applyFilters(
            {
                organizationId: productCategories.organizationId,
                isActive: productCategories.isActive,
                deletedAt: productCategories.deletedAt,
                code: productCategories.code,
                name: productCategories.name,
            },
            params,
            { organizationId }
        );

        const countQuery = db
            .select({ count: sql<number>`count(*)` })
            .from(productCategories);

        if (filters) {
            countQuery.where(filters);
        }

        const results = await countQuery;
        return Number(results[0]?.count || 0);
    }

    async create(data: typeof productCategories.$inferInsert) {
        const results = await db.insert(productCategories).values(data).returning();
        return results[0];
    }

    async update(id: string, organizationId: string, data: Partial<typeof productCategories.$inferInsert>, expectedVersion: number) {
        const results = await db
            .update(productCategories)
            .set({
                ...data,
                recordVersion: sql`${productCategories.recordVersion} + 1`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(productCategories.id, id),
                    eq(productCategories.organizationId, organizationId),
                    eq(productCategories.recordVersion, expectedVersion)
                )
            )
            .returning();
        return results[0] || null;
    }

    async delete(id: string, organizationId: string) {
        const results = await db
            .update(productCategories)
            .set({
                deletedAt: new Date(),
                isActive: false
            })
            .where(
                and(
                    eq(productCategories.id, id),
                    eq(productCategories.organizationId, organizationId)
                )
            )
            .returning();
        return results[0] || null;
    }
}
