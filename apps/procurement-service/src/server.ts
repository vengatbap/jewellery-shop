import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import procurementRoutes from './routes/procurement.routes.js';
import { requireOrganization } from '@auric-one/platform';

const app: Application = express();
const PORT = process.env.PROCUREMENT_SERVICE_PORT || 3006;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'procurement-service', timestamp: new Date().toISOString() });
});

// Tenant Isolation Middleware
app.use('/api/v1/procurement', requireOrganization);
app.use('/api/v1/procurement', procurementRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Procurement Service running on port ${PORT}`);
    });
}

export default app;
