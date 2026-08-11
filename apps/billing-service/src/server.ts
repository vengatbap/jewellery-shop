import express, { type Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { db, invoices, invoiceItems, invoicePayments } from '@auric-one/database';
import { eq, and } from 'drizzle-orm';
import { requireOrganization } from '@auric-one/platform';
import { EventBus } from '@auric-one/events';
import { PricingEngine } from './pricing-engine.js';

const app: Application = express();
const PORT = process.env.BILLING_SERVICE_PORT || 3008;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'billing-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/billing', requireOrganization);

// Preview calculation endpoint
app.post('/api/v1/billing/calculate', (req: Request, res: Response) => {
    try {
        const result = PricingEngine.calculateLineItem(req.body);
        return res.json({ success: true, data: result });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create Invoice
app.post('/api/v1/billing/invoices', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { branchId, invoiceNumber, customerId, cashierId, items, payments } = req.body;

        const [existingInvoice] = await db
            .select()
            .from(invoices)
            .where(and(eq(invoices.invoiceNumber, invoiceNumber), eq(invoices.organizationId, orgId)));

        if (existingInvoice) {
            return res.status(409).json({
                success: false,
                error: `Invoice '${invoiceNumber}' already exists in this organization (Idempotency Check)`,
                data: existingInvoice,
            });
        }

        let totalMetal = 0;
        let totalStone = 0;
        let totalMaking = 0;
        let totalWastage = 0;
        let totalDiscount = 0;
        let totalTax = 0;
        let grandTotal = 0;

        const calculatedItems = items.map((itemInput: any) => {
            const calc = PricingEngine.calculateLineItem(itemInput);
            totalMetal += calc.metalValue;
            totalStone += calc.stoneValue;
            totalMaking += calc.makingCharge;
            totalWastage += calc.wastageValue;
            totalDiscount += calc.discountAmount;
            totalTax += calc.taxAmount;
            grandTotal += calc.totalPrice;

            return {
                ...itemInput,
                metalValue: calc.metalValue.toString(),
                stoneValue: calc.stoneValue.toString(),
                makingCharge: calc.makingCharge.toString(),
                wastageValue: calc.wastageValue.toString(),
                discountAmount: calc.discountAmount.toString(),
                taxAmount: calc.taxAmount.toString(),
                totalPrice: calc.totalPrice.toString(),
            };
        });

        if (payments && payments.length > 0) {
            const totalPaid = payments.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);
            const expectedTotal = parseFloat(grandTotal.toFixed(2));
            if (Math.abs(totalPaid - expectedTotal) > 0.01) {
                return res.status(400).json({
                    success: false,
                    error: `Payment total (${totalPaid.toFixed(2)}) must exactly equal invoice grand total (${expectedTotal.toFixed(2)})`,
                });
            }
        }

        const [invoice] = await db
            .insert(invoices)
            .values({
                organizationId: orgId,
                branchId,
                invoiceNumber,
                customerId,
                cashierId,
                totalMetalValue: totalMetal.toFixed(2),
                totalStoneValue: totalStone.toFixed(2),
                totalMakingCharge: totalMaking.toFixed(2),
                totalWastageValue: totalWastage.toFixed(2),
                discountAmount: totalDiscount.toFixed(2),
                taxAmount: totalTax.toFixed(2),
                grandTotal: grandTotal.toFixed(2),
                status: 'COMPLETED',
            })
            .returning();

        // Insert items
        const insertedItems = await Promise.all(
            calculatedItems.map((item: any) =>
                db.insert(invoiceItems).values({ ...item, invoiceId: invoice.id }).returning().then(r => r[0])
            )
        );

        // Insert payments
        const insertedPayments = payments ? await Promise.all(
            payments.map((pm: any) =>
                db.insert(invoicePayments).values({ ...pm, invoiceId: invoice.id }).returning().then(r => r[0])
            )
        ) : [];

        EventBus.emit('InvoiceCreated', {
            organizationId: orgId,
            branchId,
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            grandTotal: invoice.grandTotal,
            timestamp: new Date(),
        });

        return res.status(201).json({
            success: true,
            data: {
                ...invoice,
                items: insertedItems,
                payments: insertedPayments,
            },
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Get Invoice
app.get('/api/v1/billing/invoices/:id', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const [invoice] = await db
            .select()
            .from(invoices)
            .where(and(eq(invoices.id, req.params.id), eq(invoices.organizationId, orgId)));

        if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });

        const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoice.id));
        const payments = await db.select().from(invoicePayments).where(eq(invoicePayments.invoiceId, invoice.id));

        return res.json({ success: true, data: { ...invoice, items, payments } });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Cancel / Return Invoice
app.post('/api/v1/billing/invoices/:id/cancel', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { reason } = req.body;

        const [invoice] = await db
            .select()
            .from(invoices)
            .where(and(eq(invoices.id, req.params.id), eq(invoices.organizationId, orgId)));

        if (!invoice) {
            return res.status(404).json({ success: false, error: 'Invoice not found' });
        }

        if (invoice.status === 'CANCELLED') {
            return res.status(400).json({ success: false, error: 'Invoice is already cancelled' });
        }

        const [updatedInvoice] = await db
            .update(invoices)
            .set({
                status: 'CANCELLED',
                updatedAt: new Date(),
            })
            .where(and(eq(invoices.id, invoice.id), eq(invoices.organizationId, orgId)))
            .returning();

        const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoice.id));

        EventBus.emit('InvoiceCancelled', {
            organizationId: orgId,
            branchId: invoice.branchId,
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            reason: reason || 'Customer Return',
            itemIds: items.map(i => i.itemId).filter((id): id is string => Boolean(id)),
            timestamp: new Date(),
        });

        return res.json({
            success: true,
            message: 'Invoice cancelled successfully',
            data: updatedInvoice,
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Billing/POS Service running on port ${PORT}`);
    });
}

export default app;
