import express, { type Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { db, invoices, inventoryItems } from '@auric-one/database';
import { eq, and, sql, ne } from 'drizzle-orm';
import { requireOrganization } from '@auric-one/platform';

const app: Application = express();
const PORT = process.env.REPORTING_SERVICE_PORT || 3013;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'reporting-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/reports', requireOrganization);

// Executive Dashboard KPI Summary
app.get('/api/v1/reports/dashboard', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const branchId = req.query.branchId as string | undefined;

        const invConditions = [eq(inventoryItems.organizationId, orgId)];
        if (branchId) invConditions.push(eq(inventoryItems.branchId, branchId));

        const stockSummary = await db
            .select({
                totalItems: sql<number>`count(${inventoryItems.id})`,
                totalGrossWeight: sql<string>`coalesce(sum(${inventoryItems.grossWeight}), '0.0000')`,
                totalNetWeight: sql<string>`coalesce(sum(${inventoryItems.netWeight}), '0.0000')`,
            })
            .from(inventoryItems)
            .where(and(...invConditions));

        const invoiceConditions = [
            eq(invoices.organizationId, orgId),
            eq(invoices.status, 'COMPLETED'),
        ];
        if (branchId) invoiceConditions.push(eq(invoices.branchId, branchId));

        const salesSummary = await db
            .select({
                totalInvoices: sql<number>`count(${invoices.id})`,
                totalRevenue: sql<string>`coalesce(sum(${invoices.grandTotal}), '0.00')`,
            })
            .from(invoices)
            .where(and(...invoiceConditions));

        return res.json({
            success: true,
            data: {
                organizationId: orgId,
                branchId: branchId || 'ALL',
                inventory: stockSummary[0],
                sales: salesSummary[0],
                generatedAt: new Date().toISOString(),
            },
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Daily Sales Register
app.get('/api/v1/reports/sales/daily', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const branchId = req.query.branchId as string | undefined;

        const conditions = [
            eq(invoices.organizationId, orgId),
            ne(invoices.status, 'CANCELLED'),
        ];
        if (branchId) conditions.push(eq(invoices.branchId, branchId));

        const sales = await db
            .select()
            .from(invoices)
            .where(and(...conditions))
            .limit(100);

        return res.json({ success: true, data: sales });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Inventory Weight & Valuation Summary
app.get('/api/v1/reports/inventory/valuation', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const branchId = req.query.branchId as string | undefined;

        const conditions = [eq(inventoryItems.organizationId, orgId)];
        if (branchId) conditions.push(eq(inventoryItems.branchId, branchId));

        const items = await db
            .select({
                status: inventoryItems.status,
                itemCount: sql<number>`count(${inventoryItems.id})`,
                totalGrossWeight: sql<string>`coalesce(sum(${inventoryItems.grossWeight}), '0.0000')`,
                totalNetWeight: sql<string>`coalesce(sum(${inventoryItems.netWeight}), '0.0000')`,
            })
            .from(inventoryItems)
            .where(and(...conditions))
            .groupBy(inventoryItems.status);

        return res.json({ success: true, data: items });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Reporting & Analytics Service running on port ${PORT}`);
    });
}

export default app;
