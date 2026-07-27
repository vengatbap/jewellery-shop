import { Router, Request, Response, NextFunction } from 'express';
import { BrandService } from '../services/brand.service';
import { requireOrganization } from '../middleware/tenant-isolation';
import { getExecutionContext } from '@auric-one/core';

export const brandsRouter: Router = Router();
const service = new BrandService();

brandsRouter.get('/brands', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }

        const queryParams = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            search: req.query.search as string,
            sort: req.query.sort as string,
            isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
            code: req.query.code as string,
            includeInactive: req.query.includeInactive === 'true'
        };

        const result = await service.getMany(queryParams, orgId);
        res.status(200).json({
            success: true,
            data: result.data,
            meta: {
                page: queryParams.page,
                limit: queryParams.limit,
                total: result.total
            }
        });
    } catch (err) {
        next(err);
    }
});

brandsRouter.get('/brands/:id', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }

        const brand = await service.getById(req.params.id, orgId);
        if (!brand) {
            res.status(404).json({ success: false, message: 'Brand not found' });
            return;
        }
        res.status(200).json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
});

brandsRouter.post('/brands', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }

        const userId = getExecutionContext()?.userId;
        const brand = await service.create({
            ...req.body,
            organizationId: orgId
        }, userId);
        res.status(201).json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
});

brandsRouter.put('/brands/:id', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }

        const userId = getExecutionContext()?.userId;
        const expectedVersion = req.body.recordVersion ? parseInt(req.body.recordVersion) : 1;
        const { organizationId, ...updateData } = req.body;

        const brand = await service.update(req.params.id, orgId, updateData, expectedVersion, userId);
        if (!brand) {
            res.status(404).json({ success: false, message: 'Brand not found or concurrency conflict' });
            return;
        }
        res.status(200).json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
});

brandsRouter.delete('/brands/:id', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }

        const userId = getExecutionContext()?.userId;
        const brand = await service.delete(req.params.id, orgId, userId);
        if (!brand) {
            res.status(404).json({ success: false, message: 'Brand not found' });
            return;
        }
        res.status(200).json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
});
