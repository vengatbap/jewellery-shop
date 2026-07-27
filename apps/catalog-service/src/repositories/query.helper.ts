import { SQL, and, eq, ilike, or, desc, asc, isNull } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

export interface CatalogQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    isActive?: boolean;
    code?: string;
    includeInactive?: boolean;
}

export class QueryHelper {
    static getPaginationOffset(page: number = 1, limit: number = 10) {
        const p = Math.max(1, page);
        const l = Math.max(1, limit);
        return {
            limit: l,
            offset: (p - 1) * l
        };
    }

    static applyFilters(
        columns: {
            organizationId?: PgColumn;
            isActive?: PgColumn;
            deletedAt?: PgColumn;
            code?: PgColumn;
            name?: PgColumn;
        },
        params: CatalogQueryParams,
        ctx?: { organizationId?: string }
    ): SQL | undefined {
        const conditions: SQL[] = [];

        if (columns.organizationId && ctx?.organizationId) {
            conditions.push(eq(columns.organizationId, ctx.organizationId));
        }

        if (columns.deletedAt) {
            conditions.push(isNull(columns.deletedAt));
        }

        if (columns.isActive) {
            if (params.isActive !== undefined) {
                conditions.push(eq(columns.isActive, params.isActive));
            } else if (params.includeInactive !== true) {
                conditions.push(eq(columns.isActive, true));
            }
        }

        if (columns.code && params.code) {
            conditions.push(eq(columns.code, params.code));
        }

        if (params.search) {
            const searchConditions: SQL[] = [];
            if (columns.name) {
                searchConditions.push(ilike(columns.name, `%${params.search}%`));
            }
            if (columns.code) {
                searchConditions.push(ilike(columns.code, `%${params.search}%`));
            }
            if (searchConditions.length > 0) {
                conditions.push(or(...searchConditions)!);
            }
        }

        return conditions.length > 0 ? and(...conditions) : undefined;
    }

    static applySort(
        column: PgColumn | undefined,
        direction: 'asc' | 'desc' = 'asc'
    ) {
        if (!column) return undefined;
        return direction === 'desc' ? desc(column) : asc(column);
    }
}
