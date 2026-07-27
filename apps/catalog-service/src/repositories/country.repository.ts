import { db } from '@auric-one/database';
import { countries } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';
import { QueryHelper, CatalogQueryParams } from './query.helper';

export class CountryRepository {
    async findById(id: string) {
        const results = await db
            .select()
            .from(countries)
            .where(eq(countries.id, id))
            .limit(1);
        return results[0] || null;
    }

    async findByCode(code: string) {
        const results = await db
            .select()
            .from(countries)
            .where(eq(countries.code, code))
            .limit(1);
        return results[0] || null;
    }

    async findMany(params: CatalogQueryParams) {
        const filters = QueryHelper.applyFilters(
            {
                isActive: countries.isActive,
                deletedAt: countries.deletedAt,
                code: countries.code,
                name: countries.name,
            },
            params
        );

        const { limit, offset } = QueryHelper.getPaginationOffset(params.page, params.limit);

        const query = db
            .select()
            .from(countries);

        if (filters) {
            query.where(filters);
        }

        query.limit(limit).offset(offset);

        if (params.sort) {
            const direction = params.sort.startsWith('-') ? 'desc' : 'asc';
            const cleanSort = params.sort.replace(/^-/, '');
            const column = countries[cleanSort as keyof typeof countries];
            if (column) {
                const sortExpr = QueryHelper.applySort(column as any, direction);
                if (sortExpr) {
                    query.orderBy(sortExpr);
                }
            }
        } else {
            query.orderBy(countries.displayOrder);
        }

        return query;
    }

    async count(params: CatalogQueryParams) {
        const filters = QueryHelper.applyFilters(
            {
                isActive: countries.isActive,
                deletedAt: countries.deletedAt,
                code: countries.code,
                name: countries.name,
            },
            params
        );

        const countQuery = db
            .select({ count: sql<number>`count(*)` })
            .from(countries);

        if (filters) {
            countQuery.where(filters);
        }

        const results = await countQuery;
        return Number(results[0]?.count || 0);
    }

    async create(data: typeof countries.$inferInsert) {
        const results = await db.insert(countries).values(data).returning();
        return results[0];
    }

    async update(id: string, data: Partial<typeof countries.$inferInsert>, expectedVersion: number) {
        const results = await db
            .update(countries)
            .set({
                ...data,
                recordVersion: sql`${countries.recordVersion} + 1`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(countries.id, id),
                    eq(countries.recordVersion, expectedVersion)
                )
            )
            .returning();
        return results[0] || null;
    }

    async delete(id: string) {
        const results = await db
            .update(countries)
            .set({
                deletedAt: new Date(),
                isActive: false
            })
            .where(eq(countries.id, id))
            .returning();
        return results[0] || null;
    }
}
