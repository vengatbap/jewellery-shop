import { Router, Request, Response, NextFunction } from 'express';
import { PurityService } from '../services/purity.service';

export const puritiesRouter: Router = Router();
const service = new PurityService();

puritiesRouter.get('/purities', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

puritiesRouter.get('/purities/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const purity = await service.getById(req.params.id);
        if (!purity) {
            res.status(404).json({ success: false, message: 'Purity not found' });
            return;
        }
        res.status(200).json({ success: true, data: purity });
    } catch (err) {
        next(err);
    }
});

puritiesRouter.post('/purities', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const purity = await service.create(req.body);
        res.status(201).json({ success: true, data: purity });
    } catch (err) {
        next(err);
    }
});

puritiesRouter.put('/purities/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const expectedVersion = req.body.recordVersion ? parseInt(req.body.recordVersion) : 1;
        const purity = await service.update(req.params.id, req.body, expectedVersion);
        if (!purity) {
            res.status(404).json({ success: false, message: 'Purity not found or concurrency conflict' });
            return;
        }
        res.status(200).json({ success: true, data: purity });
    } catch (err) {
        next(err);
    }
});

puritiesRouter.delete('/purities/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const purity = await service.delete(req.params.id);
        if (!purity) {
            res.status(404).json({ success: false, message: 'Purity not found' });
            return;
        }
        res.status(200).json({ success: true, data: purity });
    } catch (err) {
        next(err);
    }
});
