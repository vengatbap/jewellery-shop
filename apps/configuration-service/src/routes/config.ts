import { Router, Request, Response, NextFunction } from 'express';
import { requireOrganization } from '../middleware/tenant-isolation';
import { FinancialYearRepository } from '../repositories/financial-year.repository';
import { PaymentMethodRepository } from '../repositories/payment-method.repository';
import { TaxRuleRepository } from '../repositories/tax-rule.repository';
import { CalendarEventRepository } from '../repositories/calendar-event.repository';
import { BranchSettingsRepository } from '../repositories/branch-settings.repository';
import { getExecutionContext } from '@auric-one/core';

export const configRouter: Router = Router();

const fyRepo = new FinancialYearRepository();
const pmRepo = new PaymentMethodRepository();
const trRepo = new TaxRuleRepository();
const ceRepo = new CalendarEventRepository();
const bsRepo = new BranchSettingsRepository();

configRouter.get('/config/financial-years', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const list = await fyRepo.findMany(orgId);
        res.status(200).json({ success: true, data: list });
    } catch (err) {
        next(err);
    }
});

configRouter.post('/config/financial-years', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const item = await fyRepo.create({
            ...req.body,
            organizationId: orgId
        });
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
});

configRouter.put('/config/financial-years/:id', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const version = req.body.recordVersion ? parseInt(req.body.recordVersion) : 1;
        const { organizationId, ...updateData } = req.body;
        const item = await fyRepo.update(req.params.id, orgId, updateData, version);
        if (!item) {
            res.status(404).json({ success: false, message: 'Financial year not found or concurrency conflict' });
            return;
        }
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
});

configRouter.get('/config/payment-methods', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const list = await pmRepo.findMany(orgId);
        res.status(200).json({ success: true, data: list });
    } catch (err) {
        next(err);
    }
});

configRouter.post('/config/payment-methods', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const item = await pmRepo.create({
            ...req.body,
            organizationId: orgId
        });
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
});

configRouter.put('/config/payment-methods/:id', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const version = req.body.recordVersion ? parseInt(req.body.recordVersion) : 1;
        const { organizationId, ...updateData } = req.body;
        const item = await pmRepo.update(req.params.id, orgId, updateData, version);
        if (!item) {
            res.status(404).json({ success: false, message: 'Payment method not found or concurrency conflict' });
            return;
        }
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
});

configRouter.get('/config/tax-rules', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const list = await trRepo.findMany(orgId);
        res.status(200).json({ success: true, data: list });
    } catch (err) {
        next(err);
    }
});

configRouter.post('/config/tax-rules', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const item = await trRepo.create({
            ...req.body,
            organizationId: orgId
        });
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
});

configRouter.put('/config/tax-rules/:id', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const version = req.body.recordVersion ? parseInt(req.body.recordVersion) : 1;
        const { organizationId, ...updateData } = req.body;
        const item = await trRepo.update(req.params.id, orgId, updateData, version);
        if (!item) {
            res.status(404).json({ success: false, message: 'Tax rule not found or concurrency conflict' });
            return;
        }
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
});

configRouter.get('/config/calendar-events', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const list = await ceRepo.findMany(orgId);
        res.status(200).json({ success: true, data: list });
    } catch (err) {
        next(err);
    }
});

configRouter.post('/config/calendar-events', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const item = await ceRepo.create({
            ...req.body,
            organizationId: orgId
        });
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
});

configRouter.put('/config/calendar-events/:id', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const version = req.body.recordVersion ? parseInt(req.body.recordVersion) : 1;
        const { organizationId, ...updateData } = req.body;
        const item = await ceRepo.update(req.params.id, orgId, updateData, version);
        if (!item) {
            res.status(404).json({ success: false, message: 'Calendar event not found or concurrency conflict' });
            return;
        }
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
});

configRouter.get('/config/branch-settings/:branchId/:aggregate', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const { branchId, aggregate } = req.params;

        let result;
        switch (aggregate) {
            case 'pos':
                result = await bsRepo.getPosSettings(branchId, orgId);
                break;
            case 'inventory':
                result = await bsRepo.getInventorySettings(branchId, orgId);
                break;
            case 'accounting':
                result = await bsRepo.getAccountingSettings(branchId, orgId);
                break;
            case 'pricing':
                result = await bsRepo.getPricingSettings(branchId, orgId);
                break;
            case 'printing':
                result = await bsRepo.getPrintingSettings(branchId, orgId);
                break;
            case 'notification':
                result = await bsRepo.getNotificationSettings(branchId, orgId);
                break;
            default:
                res.status(400).json({ success: false, message: `Invalid settings aggregate: ${aggregate}` });
                return;
        }

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
});

configRouter.post('/config/branch-settings/:branchId/:aggregate', requireOrganization, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orgId = getExecutionContext()?.organizationId || req.context?.tenantId;
        if (!orgId) {
            res.status(401).json({ success: false, message: 'Organization context missing' });
            return;
        }
        const { branchId, aggregate } = req.params;
        const { organizationId, branchId: reqBranchId, ...data } = req.body;

        let result;
        switch (aggregate) {
            case 'pos':
                result = await bsRepo.upsertPosSettings(branchId, orgId, data);
                break;
            case 'inventory':
                result = await bsRepo.upsertInventorySettings(branchId, orgId, data);
                break;
            case 'accounting':
                result = await bsRepo.upsertAccountingSettings(branchId, orgId, data);
                break;
            case 'pricing':
                result = await bsRepo.upsertPricingSettings(branchId, orgId, data);
                break;
            case 'printing':
                result = await bsRepo.upsertPrintingSettings(branchId, orgId, data);
                break;
            case 'notification':
                result = await bsRepo.upsertNotificationSettings(branchId, orgId, data);
                break;
            default:
                res.status(400).json({ success: false, message: `Invalid settings aggregate: ${aggregate}` });
                return;
        }

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
});
