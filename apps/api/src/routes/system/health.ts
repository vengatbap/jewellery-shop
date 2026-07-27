import { Router, type Request, type Response } from 'express';
import { createSuccessResponse } from '@auric-one/core';

export const systemRouter: Router = Router();

systemRouter.get('/health', (req: Request, res: Response) => {
    const requestId = req.context?.requestId || 'system';
    res.status(200).json(
        createSuccessResponse('Process is healthy', { status: 'OK' }, requestId)
    );
});

systemRouter.get('/ready', (req: Request, res: Response) => {
    const requestId = req.context?.requestId || 'system';
    // Eventually check database connection, redis, etc.
    res.status(200).json(
        createSuccessResponse('Gateway is ready', { ready: true }, requestId)
    );
});

systemRouter.get('/version', (req: Request, res: Response) => {
    const requestId = req.context?.requestId || 'system';
    res.status(200).json(
        createSuccessResponse('Version metadata', {
            product: 'Auric One',
            service: 'gateway',
            version: '0.1.0-alpha',
            architecture: 'Foundation 1.0',
            commit: process.env.COMMIT_HASH || 'dev-local',
            build: new Date().toISOString()
        }, requestId)
    );
});
