import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, OrganizationService } from '@auric-one/platform';
import { ApiResponse, getExecutionContext } from '@auric-one/core';

export const organizationsRouter: Router = Router();

// GET /api/v1/organizations/current
organizationsRouter.get('/organizations/current', authenticate, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const context = getExecutionContext();
        if (!context || !context.organizationId) {
            res.status(400).json(ApiResponse.error('No organization context bound', 'CONTEXT_ERROR', 400));
            return;
        }

        const org = await OrganizationService.getById(context.organizationId);
        if (!org) {
            res.status(404).json(ApiResponse.error('Organization not found', 'NOT_FOUND', 404));
            return;
        }

        res.status(200).json(ApiResponse.success(org, 'Current organization context fetched'));
    } catch (error) {
        next(error);
    }
});
