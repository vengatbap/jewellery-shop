import { Router, Request, Response, NextFunction } from 'express';
import { CountryService } from '../services/country.service';

export const countriesRouter: Router = Router();
const service = new CountryService();

countriesRouter.get('/countries', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

countriesRouter.get('/countries/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const country = await service.getById(req.params.id);
        if (!country) {
            res.status(404).json({ success: false, message: 'Country not found' });
            return;
        }
        res.status(200).json({ success: true, data: country });
    } catch (err) {
        next(err);
    }
});

countriesRouter.post('/countries', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const country = await service.create(req.body);
        res.status(201).json({ success: true, data: country });
    } catch (err) {
        next(err);
    }
});

countriesRouter.put('/countries/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const expectedVersion = req.body.recordVersion ? parseInt(req.body.recordVersion) : 1;
        const country = await service.update(req.params.id, req.body, expectedVersion);
        if (!country) {
            res.status(404).json({ success: false, message: 'Country not found or concurrency conflict' });
            return;
        }
        res.status(200).json({ success: true, data: country });
    } catch (err) {
        next(err);
    }
});

countriesRouter.delete('/countries/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const country = await service.delete(req.params.id);
        if (!country) {
            res.status(404).json({ success: false, message: 'Country not found' });
            return;
        }
        res.status(200).json({ success: true, data: country });
    } catch (err) {
        next(err);
    }
});
