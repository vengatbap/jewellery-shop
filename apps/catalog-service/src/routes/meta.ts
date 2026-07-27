import { Router, Request, Response, NextFunction } from 'express';
import { requireOrganization } from '../middleware/tenant-isolation';
import { db } from '@auric-one/database';
import { brands, collections, productCategories, metals, purities, countries } from '@auric-one/database';
import { eq, and, sql, isNull } from 'drizzle-orm';
import { getExecutionContext } from '@auric-one/core';

export const metaRouter: Router = Router();

metaRouter.get('/catalog/meta', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }

        const [
            brandsCount,
            collectionsCount,
            categoriesCount,
            metalsCount,
            puritiesCount,
            countriesCount
        ] = await Promise.all([
            db.select({ count: sql<number>`count(*)` }).from(brands).where(and(eq(brands.organizationId, orgId), isNull(brands.deletedAt), eq(brands.isActive, true))),
            db.select({ count: sql<number>`count(*)` }).from(collections).where(and(eq(collections.organizationId, orgId), isNull(collections.deletedAt), eq(collections.isActive, true))),
            db.select({ count: sql<number>`count(*)` }).from(productCategories).where(and(eq(productCategories.organizationId, orgId), isNull(productCategories.deletedAt), eq(productCategories.isActive, true))),
            db.select({ count: sql<number>`count(*)` }).from(metals).where(and(isNull(metals.deletedAt), eq(metals.isActive, true))),
            db.select({ count: sql<number>`count(*)` }).from(purities).where(and(isNull(purities.deletedAt), eq(purities.isActive, true))),
            db.select({ count: sql<number>`count(*)` }).from(countries).where(and(isNull(countries.deletedAt), eq(countries.isActive, true)))
        ]);

        res.status(200).json({
            success: true,
            data: {
                brands: Number(brandsCount[0]?.count || 0),
                collections: Number(collectionsCount[0]?.count || 0),
                categories: Number(categoriesCount[0]?.count || 0),
                metals: Number(metalsCount[0]?.count || 0),
                purities: Number(puritiesCount[0]?.count || 0),
                countries: Number(countriesCount[0]?.count || 0)
            }
        });
    } catch (err) {
        next(err);
    }
});
