import type { Request, Response, NextFunction } from 'express';
import { logger } from './logger.js';

export interface RequestContext {
    requestId?: string;
    tenantId?: string;
    branchId?: string;
    userId?: string;
    service?: string;
    module?: string;
    action?: string;
}

declare global {
    namespace Express {
        interface Request {
            context?: RequestContext;
        }
    }
}

export function requestLogger(serviceName: string, moduleName?: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        const requestId = req.headers['x-request-id'] as string || req.context?.requestId;
        const tenantId = req.headers['x-tenant-id'] as string || req.context?.tenantId;
        const branchId = req.headers['x-branch-id'] as string || req.context?.branchId;
        const userId = req.headers['x-user-id'] as string || req.context?.userId;

        // Populate request context
        req.context = {
            ...req.context,
            requestId,
            tenantId,
            branchId,
            userId,
            service: serviceName,
            module: moduleName
        };

        const logDetails = {
            requestId,
            tenantId,
            branchId,
            userId,
            service: serviceName,
            module: moduleName,
            method: req.method,
            url: req.originalUrl || req.url
        };

        logger.info(logDetails, `Incoming request ${req.method} ${logDetails.url}`);

        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info(
                {
                    ...logDetails,
                    statusCode: res.statusCode,
                    duration
                },
                `Request completed ${req.method} ${logDetails.url} - ${res.statusCode} (${duration}ms)`
            );
        });

        next();
    };
}
