import { Router, Request, Response, NextFunction } from 'express';
import { MetalService } from '../services/metal.service';

export const metalsRouter: Router = Router();
const service = new MetalService();

metalsRouter.get('/metals', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const queryParams = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            search: req.query.search as string,
            sort: req.query.sort as string,
            isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
            code: req.query.code as string,
            includeInactive: req.query.includeInactive === 'true'
        };

        const result = await service.getMany(queryParams);
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

metalsRouter.get('/metals/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const metal = await service.getById(req.params.id);
        if (!metal) {
            res.status(404).json({ success: false, message: 'Metal not found' });
            return;
        }
        res.status(200).json({ success: true, data: metal });
    } catch (err) {
        next(err);
    }
});

metalsRouter.post('/metals', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const metal = await service.create(req.body);
        res.status(201).json({ success: true, data: metal });
    } catch (err) {
        next(err);
    }
});

metalsRouter.put('/metals/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const expectedVersion = req.body.recordVersion ? parseInt(req.body.recordVersion) : 1;
        const metal = await service.update(req.params.id, req.body, expectedVersion);
        if (!metal) {
            res.status(404).json({ success: false, message: 'Metal not found or concurrency conflict' });
            return;
        }
        res.status(200).json({ success: true, data: metal });
    } catch (err) {
        next(err);
    }
});

metalsRouter.delete('/metals/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const metal = await service.delete(req.params.id);
        if (!metal) {
            res.status(404).json({ success: false, message: 'Metal not found' });
            return;
        }
        res.status(200).json({ success: true, data: metal });
    } catch (err) {
        next(err);
    }
});
