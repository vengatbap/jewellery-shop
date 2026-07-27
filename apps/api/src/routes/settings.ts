import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, SettingsService, requirePermission } from '@auric-one/platform';
import { ApiResponse, getExecutionContext } from '@auric-one/core';

export const settingsRouter: Router = Router();

// GET /api/v1/settings/invoice
settingsRouter.get('/settings/invoice', authenticate, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const context = getExecutionContext();
        if (!context || !context.organizationId) {
            res.status(400).json(ApiResponse.error('Organization context missing', 'CONTEXT_ERROR', 400));
            return;
        }

        const settings = await SettingsService.getInvoiceSettings(context.organizationId, context.branchId);
        res.status(200).json(ApiResponse.success(settings, 'Invoice settings fetched'));
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/settings/invoice
settingsRouter.post('/settings/invoice', authenticate, requirePermission('organization:manage'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { prefix, suffix, nextNumber, taxEnabled } = req.body;
        const context = getExecutionContext();
        
        if (!context || !context.organizationId) {
            res.status(400).json(ApiResponse.error('Organization context missing', 'CONTEXT_ERROR', 400));
            return;
        }

        await SettingsService.updateInvoiceSettings(context.organizationId, context.branchId || null, {
            prefix,
            suffix,
            nextNumber,
            taxEnabled,
        });

        res.status(200).json(ApiResponse.success(null, 'Invoice settings updated successfully'));
    } catch (error) {
        next(error);
    }
});

// GET /api/v1/settings/gold-rate
settingsRouter.get('/settings/gold-rate', authenticate, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const context = getExecutionContext();
        if (!context || !context.organizationId) {
            res.status(400).json(ApiResponse.error('Organization context missing', 'CONTEXT_ERROR', 400));
            return;
        }

        const settings = await SettingsService.getGoldRateSettings(context.organizationId, context.branchId);
        res.status(200).json(ApiResponse.success(settings, 'Gold rate settings fetched'));
    } catch (error) {
        next(error);
    }
});

// GET /api/v1/settings/barcode
settingsRouter.get('/settings/barcode', authenticate, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const context = getExecutionContext();
        if (!context || !context.organizationId) {
            res.status(400).json(ApiResponse.error('Organization context missing', 'CONTEXT_ERROR', 400));
            return;
        }

        const settings = await SettingsService.getBarcodeSettings(context.organizationId, context.branchId);
        res.status(200).json(ApiResponse.success(settings, 'Barcode settings fetched'));
    } catch (error) {
        next(error);
    }
});
