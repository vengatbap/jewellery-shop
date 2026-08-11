import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { db, metalRates } from '@auric-one/database';
import { eq, and, desc } from 'drizzle-orm';
import { requireOrganization } from '@auric-one/platform';
import { EventBus } from '@auric-one/events';

const app: Application = express();
const PORT = process.env.GOLD_RATE_SERVICE_PORT || 3007;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'gold-rate-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/gold-rates', requireOrganization);

app.get('/api/v1/gold-rates/latest', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const metalId = req.query.metalId as string | undefined;
        const purityId = req.query.purityId as string | undefined;

        const conditions = [eq(metalRates.organizationId, orgId)];
        if (metalId) conditions.push(eq(metalRates.metalId, metalId));
        if (purityId) conditions.push(eq(metalRates.purityId, purityId));

        const rates = await db
            .select()
            .from(metalRates)
            .where(and(...conditions))
            .orderBy(desc(metalRates.effectiveAt))
            .limit(20);

        return res.json({ success: true, data: rates });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/v1/gold-rates', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { metalId, purityId, ratePerGram } = req.body;

        const [rate] = await db
            .insert(metalRates)
            .values({
                organizationId: orgId,
                metalId,
                purityId,
                ratePerGram,
                effectiveAt: new Date(),
            })
            .returning();

        EventBus.emit('MetalRateUpdated', {
            organizationId: orgId,
            metalId,
            purityId,
            ratePerGram,
            timestamp: new Date(),
        });

        return res.status(201).json({ success: true, data: rate });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Gold Rate Service running on port ${PORT}`);
    });
}

export default app;
