import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function requestId(req: Request, res: Response, next: NextFunction) {
    const headerName = 'x-request-id';
    let requestId = req.headers[headerName] as string || req.headers['X-Request-ID'] as string;

    if (!requestId) {
        requestId = randomUUID();
    }

    req.headers[headerName] = requestId;
    res.setHeader(headerName, requestId);

    if (!req.context) {
        req.context = {};
    }
    req.context.requestId = requestId;

    next();
}
