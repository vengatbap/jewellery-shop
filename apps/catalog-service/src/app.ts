import express, { type Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { config } from '@auric-one/config';
import { requestId, requestLogger, errorHandler, executionContextMiddleware } from '@auric-one/core';
import { brandsRouter } from './routes/brands.js';
import { collectionsRouter } from './routes/collections.js';
import { categoriesRouter } from './routes/categories.js';
import { metalsRouter } from './routes/metals.js';
import { puritiesRouter } from './routes/purities.js';
import { countriesRouter } from './routes/countries.js';
import { metaRouter } from './routes/meta.js';

const app: Application = express();

app.use(helmet());
app.use(compression());
app.use(requestId);
app.use(requestLogger('catalog-service'));
app.use(executionContextMiddleware('catalog-service'));

app.use(cors({
    origin: config.cors.origin,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiPrefix = config.app.prefix || '/api/v1';

app.use(apiPrefix, brandsRouter);
app.use(apiPrefix, collectionsRouter);
app.use(apiPrefix, categoriesRouter);
app.use(apiPrefix, metalsRouter);
app.use(apiPrefix, puritiesRouter);
app.use(apiPrefix, countriesRouter);
app.use(apiPrefix, metaRouter);

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP', service: 'catalog-service' });
});

app.use(errorHandler);

export { app };
