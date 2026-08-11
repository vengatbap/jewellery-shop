import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import productRoutes from './routes/product.routes.js';
import { requireOrganization } from '@auric-one/platform';

const app: Application = express();
const PORT = process.env.PRODUCT_SERVICE_PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'product-service', timestamp: new Date().toISOString() });
});

// Tenant Isolation Middleware
app.use('/api/v1/products', requireOrganization);
app.use('/api/v1/products', productRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Product Service running on port ${PORT}`);
    });
}

export default app;
