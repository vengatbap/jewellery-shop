import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { createErrorResponse } from '../http/ApiResponse.js';
import { logger } from '../logger/logger.js';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
    const requestId = (req.context?.requestId || req.headers['x-request-id'] || 'system') as string;
    
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errors: any[] = [];

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorCode = err.errorCode;
        if (err.details) {
            if (Array.isArray(err.details)) {
                errors = err.details;
            } else {
                errors = [{ code: err.errorCode, message: err.message, ...err.details }];
            }
        } else {
            errors = [{ code: err.errorCode, message: err.message }];
        }
    } else {
        // Log unexpected error details
        logger.error(
            {
                err: {
                    message: err.message,
                    stack: err.stack,
                    ...err
                },
                requestId,
                tenantId: req.context?.tenantId,
                userId: req.context?.userId
            },
            `Unhandled exception: ${err.message}`
        );
        errors = [{ code: errorCode, message }];
    }

    res.status(statusCode).json(createErrorResponse(message, errors, requestId));
}
