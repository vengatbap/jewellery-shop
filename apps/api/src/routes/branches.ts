import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, BranchService } from '@auric-one/platform';
import { ApiResponse, getExecutionContext } from '@auric-one/core';
import { db } from '@auric-one/database';
import { sessions } from '@auric-one/database/schema';
import { eq } from 'drizzle-orm';

export const branchesRouter: Router = Router();

// GET /api/v1/branches/current
branchesRouter.get('/branches/current', authenticate, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const context = getExecutionContext();
        if (!context || !context.sessionId) {
            res.status(400).json(ApiResponse.error('No session context bound', 'CONTEXT_ERROR', 400));
            return;
        }

        const [session] = await db
            .select()
            .from(sessions)
            .where(eq(sessions.id, context.sessionId));

        const activeBranchId = session?.currentBranchId || context.branchId;
        if (!activeBranchId) {
            res.status(200).json(ApiResponse.success(null, 'No active branch selected'));
            return;
        }

        const branch = await BranchService.getById(activeBranchId);
        res.status(200).json(ApiResponse.success(branch, 'Current branch context fetched'));
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/branches/switch
branchesRouter.post('/branches/switch', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { branchId } = req.body;
        const context = getExecutionContext();
        
        if (!context || !context.sessionId) {
            res.status(400).json(ApiResponse.error('No session context bound', 'CONTEXT_ERROR', 400));
            return;
        }

        await BranchService.switchBranch(context.sessionId, branchId);
        res.status(200).json(ApiResponse.success(null, 'Branch switched successfully'));
    } catch (error) {
        next(error);
    }
});
