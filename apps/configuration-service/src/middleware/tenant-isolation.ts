import { Request, Response, NextFunction } from 'express';
import { getExecutionContext } from '@auric-one/core';

export function requireOrganization(req: Request, res: Response, next: NextFunction): void {
    const context = getExecutionContext();
    const orgId = context?.organizationId || req.context?.tenantId;

    if (!orgId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required: organization context missing from headers.',
            errors: [{ code: 'ORGANIZATION_CONTEXT_REQUIRED', message: 'x-tenant-id or x-organization-id header is required.' }]
        });
        return;
    }

    req.context = {
        ...req.context,
        tenantId: orgId
    };

    next();
}
