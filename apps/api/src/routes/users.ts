import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, UserService, InvitationService, requirePermission } from '@auric-one/platform';
import { ApiResponse, getExecutionContext } from '@auric-one/core';

export const usersRouter: Router = Router();

// GET /api/v1/users/me
usersRouter.get('/users/me', authenticate, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const context = getExecutionContext();
        if (!context || !context.userId) {
            res.status(401).json(ApiResponse.error('Unauthorized', 'UNAUTHORIZED', 401));
            return;
        }

        const user = await UserService.getById(context.userId);
        if (!user) {
            res.status(404).json(ApiResponse.error('User not found', 'NOT_FOUND', 404));
            return;
        }

        res.status(200).json(ApiResponse.success(user, 'User profile fetched successfully'));
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/users/invite
usersRouter.post('/users/invite', authenticate, requirePermission('user:manage'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, firstName, lastName } = req.body;
        const context = getExecutionContext();
        
        if (!context || !context.organizationId) {
            res.status(400).json(ApiResponse.error('Organization context missing', 'CONTEXT_ERROR', 400));
            return;
        }

        const pendingUserId = await InvitationService.inviteUser(context.organizationId, email, firstName, lastName);
        res.status(201).json(ApiResponse.success({ userId: pendingUserId }, 'User invited successfully'));
    } catch (error) {
        next(error);
    }
});
