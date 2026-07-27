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
import { systemRouter } from './routes/system/health';
import { authRouter } from './routes/auth';
import { organizationsRouter } from './routes/organizations';
import { branchesRouter } from './routes/branches';
import { usersRouter } from './routes/users';
import { settingsRouter } from './routes/settings';

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

// 9. Error Handler
app.use(errorHandler);

export { app };
