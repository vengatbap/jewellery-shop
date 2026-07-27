import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import os from 'os';
import { runWithContext, type ExecutionContext } from '../context/execution-context';

const hostname = os.hostname();
const environment = process.env.NODE_ENV || 'development';

export function executionContextMiddleware(serviceName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const requestId = (req.headers['x-request-id'] as string || req.headers['X-Request-ID'] as string || randomUUID());
        const correlationId = (req.headers['x-correlation-id'] as string || req.headers['X-Correlation-ID'] as string || requestId);
        const traceId = (req.headers['x-trace-id'] as string || req.headers['X-Trace-ID'] as string || requestId);

        // Inject request headers for downstream compatibility
        req.headers['x-request-id'] = requestId;
        req.headers['x-correlation-id'] = correlationId;
        req.headers['x-trace-id'] = traceId;
        res.setHeader('x-request-id', requestId);

        const organizationId = req.headers['x-tenant-id'] as string || req.headers['x-organization-id'] as string || undefined;
        const branchId = req.headers['x-branch-id'] as string || undefined;
        const userId = req.headers['x-user-id'] as string || undefined;
        
        let roleIds: string[] | undefined;
        const roleIdsHeader = req.headers['x-role-ids'] as string;
        if (roleIdsHeader) {
            try {
                roleIds = roleIdsHeader.split(',').map(id => id.trim());
            } catch {
                // Ignore malformed role IDs header
            }
        }

        const locale = req.headers['x-locale'] as string || 'en';
        const timezone = req.headers['x-timezone'] as string || 'UTC';
        const currency = req.headers['x-currency'] as string || 'INR';

        const context: ExecutionContext = {
            requestId,
            correlationId,
            traceId,
            startedAt: new Date(),
            service: serviceName,
            environment,
            hostname,
            organizationId,
            branchId,
            userId,
            roleIds,
            locale,
            timezone,
            currency
        };

        // Attach to Express req object for legacy usage
        req.context = {
            ...req.context,
            requestId,
            tenantId: organizationId,
            branchId,
            userId,
            service: serviceName
        };

        runWithContext(context, () => {
            next();
        });
    };
}
