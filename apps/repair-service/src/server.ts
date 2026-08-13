import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { db, repairJobCards, repairItems, repairLabor } from '@auric-one/database';
import { eq, and } from 'drizzle-orm';
import { requireOrganization } from '@auric-one/platform';
import { EventBus } from '@auric-one/events';

const app: Express = express();
const PORT = process.env.REPAIR_SERVICE_PORT || 3016;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'repair-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/repair', requireOrganization);

// Get Repair Job Cards
app.get('/api/v1/repair/jobs', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const branchId = req.query.branchId as string | undefined;

        const conditions = [eq(repairJobCards.organizationId, orgId)];
        if (branchId) conditions.push(eq(repairJobCards.branchId, branchId));

        const jobs = await db
            .select()
            .from(repairJobCards)
            .where(and(...conditions))
            .limit(50);

        return res.json({ success: true, data: jobs });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Get Single Repair Job Card by ID
app.get('/api/v1/repair/jobs/:id', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;

        const [job] = await db
            .select()
            .from(repairJobCards)
            .where(and(eq(repairJobCards.id, req.params.id), eq(repairJobCards.organizationId, orgId)));

        if (!job) return res.status(404).json({ success: false, error: 'Repair job card not found' });

        const items = await db
            .select()
            .from(repairItems)
            .where(eq(repairItems.jobId, job.id));

        const labor = await db
            .select()
            .from(repairLabor)
            .where(eq(repairLabor.jobId, job.id));

        return res.json({
            success: true,
            data: {
                ...job,
                items,
                labor,
            },
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create Repair Job Card Intake
app.post('/api/v1/repair/jobs', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { branchId, customerId, jobNumber, artisanId, promisedDeliveryDate, totalEstimatedCost, advancePaid, items } = req.body;

        const [job] = await db
            .insert(repairJobCards)
            .values({
                organizationId: orgId,
                branchId,
                customerId,
                jobNumber,
                artisanId,
                promisedDeliveryDate: promisedDeliveryDate ? new Date(promisedDeliveryDate) : undefined,
                status: 'INTAKE',
                totalEstimatedCost: totalEstimatedCost || '0.00',
                advancePaid: advancePaid || '0.00',
            })
            .returning();

        const insertedItems = items ? await Promise.all(
            items.map((item: any) =>
                db.insert(repairItems).values({ ...item, jobId: job.id }).returning().then(r => r[0])
            )
        ) : [];

        EventBus.emit('RepairJobIntakeCreated', {
            organizationId: orgId,
            branchId,
            jobId: job.id,
            jobNumber: job.jobNumber,
            timestamp: new Date(),
        });

        return res.status(201).json({
            success: true,
            data: {
                ...job,
                items: insertedItems,
            },
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Update Job Card Status
app.post('/api/v1/repair/jobs/:id/status', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { status, finalCost } = req.body;

        const [updatedJob] = await db
            .update(repairJobCards)
            .set({
                status,
                finalCost: finalCost || undefined,
                updatedAt: new Date(),
            })
            .where(and(eq(repairJobCards.id, req.params.id), eq(repairJobCards.organizationId, orgId)))
            .returning();

        if (!updatedJob) return res.status(404).json({ success: false, error: 'Repair job card not found' });

        EventBus.emit('RepairJobStatusUpdated', {
            organizationId: orgId,
            jobId: updatedJob.id,
            status: updatedJob.status,
            timestamp: new Date(),
        });

        return res.json({ success: true, data: updatedJob });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Add Labor Entry to Repair Job
app.post('/api/v1/repair/jobs/:id/labor', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { laborDescription, laborCost, materialsCost, totalCharge } = req.body;

        const [job] = await db
            .select()
            .from(repairJobCards)
            .where(and(eq(repairJobCards.id, req.params.id), eq(repairJobCards.organizationId, orgId)));

        if (!job) return res.status(404).json({ success: false, error: 'Repair job card not found' });

        const [laborEntry] = await db
            .insert(repairLabor)
            .values({
                jobId: job.id,
                laborDescription,
                laborCost: laborCost || '0.00',
                materialsCost: materialsCost || '0.00',
                totalCharge: totalCharge || laborCost || '0.00',
            })
            .returning();

        return res.status(201).json({ success: true, data: laborEntry });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Repair Service running on port ${PORT}`);
    });
}

export default app;
