import express, { type Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { config } from '@auric-one/config';
import { requestId, requestLogger, errorHandler, executionContextMiddleware } from '@auric-one/core';
import { configRouter } from './routes/config.js';

const app: Application = express();

app.use(helmet());
app.use(compression());
app.use(requestId);
app.use(requestLogger('configuration-service'));
app.use(executionContextMiddleware('configuration-service'));

app.use(cors({
    origin: config.cors.origin,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiPrefix = config.app.prefix || '/api/v1';

app.use(apiPrefix, configRouter);

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP', service: 'configuration-service' });
});

app.use(errorHandler);

export { app };
