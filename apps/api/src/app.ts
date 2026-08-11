import express, { type Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { config } from '@auric-one/config';
import { requestId, requestLogger, errorHandler } from '@auric-one/core';
import { systemRouter } from './routes/system/health.js';
import { authRouter } from './routes/auth.js';
import { organizationsRouter } from './routes/organizations.js';
import { branchesRouter } from './routes/branches.js';
import { usersRouter } from './routes/users.js';
import { settingsRouter } from './routes/settings.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const openapiSpec = JSON.parse(
    readFileSync(join(__dirname, 'openapi.json'), 'utf8')
);

const app: Application = express();

// 1. Helmet (Security Headers)
app.use(helmet());

// 2. Compression
app.use(compression());

// 3. Request ID
app.use(requestId);

// 4. Pino Logger
app.use(requestLogger('gateway'));

// 5. CORS
app.use(cors({
    origin: config.cors.origin,
    credentials: true
}));

// 6. Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
        errors: [{ code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests.' }]
    }
});
app.use(limiter);

// 7. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 8. Routes
app.get('/docs', (_req, res) => {
    res.status(200).json(openapiSpec);
});
app.use(config.app.prefix || '/api/v1', systemRouter);
app.use(config.app.prefix || '/api/v1', authRouter);
app.use(config.app.prefix || '/api/v1', organizationsRouter);
app.use(config.app.prefix || '/api/v1', branchesRouter);
app.use(config.app.prefix || '/api/v1', usersRouter);
app.use(config.app.prefix || '/api/v1', settingsRouter);

// Reverse Proxy for Microservices
const serviceMap: Record<string, string> = {
    '/api/v1/catalog': process.env.CATALOG_SERVICE_URL || 'http://localhost:3001',
    '/api/v1/configuration': process.env.CONFIGURATION_SERVICE_URL || 'http://localhost:3002',
    '/api/v1/product': process.env.PRODUCT_SERVICE_URL || 'http://localhost:3004',
    '/api/v1/inventory': process.env.INVENTORY_SERVICE_URL || 'http://localhost:3005',
    '/api/v1/procurement': process.env.PROCUREMENT_SERVICE_URL || 'http://localhost:3006',
    '/api/v1/gold-rates': process.env.GOLD_RATE_SERVICE_URL || 'http://localhost:3007',
    '/api/v1/billing': process.env.BILLING_SERVICE_URL || 'http://localhost:3008',
    '/api/v1/accounting': process.env.ACCOUNTING_SERVICE_URL || 'http://localhost:3009',
    '/api/v1/schemes': process.env.SCHEME_SERVICE_URL || 'http://localhost:3010',
    '/api/v1/customers': process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3011',
    '/api/v1/pawn': process.env.GOLD_LOAN_SERVICE_URL || 'http://localhost:3012',
    '/api/v1/reports': process.env.REPORTING_SERVICE_URL || 'http://localhost:3013',
    '/api/v1/commerce': process.env.ECOMMERCE_SERVICE_URL || 'http://localhost:3014',
    '/api/v1/multibranch': process.env.MULTIBRANCH_SERVICE_URL || 'http://localhost:3015',
    '/api/v1/repair': process.env.REPAIR_SERVICE_URL || 'http://localhost:3016',
};

Object.entries(serviceMap).forEach(([pathPrefix, targetBaseUrl]) => {
    app.use(pathPrefix, async (req, res, next) => {
        try {
            const targetUrl = `${targetBaseUrl}${req.originalUrl}`;
            const headers: Record<string, string> = {};
            Object.keys(req.headers).forEach(k => {
                if (typeof req.headers[k] === 'string') {
                    headers[k] = req.headers[k] as string;
                }
            });

            const init: RequestInit = {
                method: req.method,
                headers,
            };

            if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
                init.body = JSON.stringify(req.body);
                headers['content-type'] = 'application/json';
            }

            const response = await fetch(targetUrl, init);
            const data = await response.json();
            return res.status(response.status).json(data);
        } catch (error: any) {
            return next(error);
        }
    });
});

// 9. Error Handler
app.use(errorHandler);

export { app };
