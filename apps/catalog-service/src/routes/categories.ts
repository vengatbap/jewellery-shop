import { Router, Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { requireOrganization } from '../middleware/tenant-isolation';
import { getExecutionContext } from '@auric-one/core';

export const categoriesRouter: Router = Router();
const service = new CategoryService();

categoriesRouter.get('/categories', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

categoriesRouter.get('/categories/:id', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }

        const category = await service.getById(req.params.id, orgId);
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
});

categoriesRouter.post('/categories', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }

        const userId = getExecutionContext()?.userId;
        const category = await service.create({
            ...req.body,
            organizationId: orgId
        }, userId);
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
});

categoriesRouter.put('/categories/:id', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }

        const userId = getExecutionContext()?.userId;
        const expectedVersion = req.body.recordVersion ? parseInt(req.body.recordVersion) : 1;
        const { organizationId, ...updateData } = req.body;

        const category = await service.update(req.params.id, orgId, updateData, expectedVersion, userId);
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found or concurrency conflict' });
            return;
        }
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
});

categoriesRouter.delete('/categories/:id', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }

        const userId = getExecutionContext()?.userId;
        const category = await service.delete(req.params.id, orgId, userId);
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        next(err);
    }
});
