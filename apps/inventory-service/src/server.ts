import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import inventoryRoutes from './routes/inventory.routes.js';
import { requireOrganization } from '@auric-one/platform';

const app: Application = express();
const PORT = process.env.INVENTORY_SERVICE_PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'inventory-service', timestamp: new Date().toISOString() });
});

// Tenant Isolation Middleware
app.use('/api/v1/inventory', requireOrganization);
app.use('/api/v1/inventory', inventoryRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Inventory Service running on port ${PORT}`);
    });
}

export default app;
