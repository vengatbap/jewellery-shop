import express, { type Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { db, schemeDefinitions, customerSchemes, schemeInstallments, schemeRedemptions } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';
import { requireOrganization } from '@auric-one/platform';
import { EventBus } from '@auric-one/events';

const app: Application = express();
const PORT = process.env.SCHEME_SERVICE_PORT || 3010;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'scheme-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/schemes', requireOrganization);

// Get Scheme Definitions
app.get('/api/v1/schemes/definitions', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const list = await db
            .select()
            .from(schemeDefinitions)
            .where(and(eq(schemeDefinitions.organizationId, orgId), eq(schemeDefinitions.isActive, true)));

        return res.json({ success: true, data: list });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create Scheme Definition
app.post('/api/v1/schemes/definitions', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { schemeCode, name, schemeType, durationMonths, minimumInstallmentAmount, bonusPercentage, bonusFixedAmount } = req.body;

        const [existingDef] = await db
            .select()
            .from(schemeDefinitions)
            .where(and(eq(schemeDefinitions.schemeCode, schemeCode), eq(schemeDefinitions.organizationId, orgId)));

        if (existingDef) {
            return res.status(409).json({
                success: false,
                error: `Scheme definition with code '${schemeCode}' already exists in this organization`,
            });
        }

        const [def] = await db
            .insert(schemeDefinitions)
            .values({
                organizationId: orgId,
                schemeCode,
                name,
                schemeType,
                durationMonths,
                minimumInstallmentAmount,
                bonusPercentage: bonusPercentage || '0.00',
                bonusFixedAmount: bonusFixedAmount || '0.00',
                isActive: true,
            })
            .returning();

        return res.status(201).json({ success: true, data: def });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Enroll Customer in Scheme
app.post('/api/v1/schemes/enroll', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { branchId, schemeId, customerId, accountNumber } = req.body;

        const [def] = await db
            .select()
            .from(schemeDefinitions)
            .where(and(eq(schemeDefinitions.id, schemeId), eq(schemeDefinitions.organizationId, orgId)));

        if (!def) return res.status(404).json({ success: false, error: 'Scheme definition not found in this organization' });

        const [existingAcc] = await db
            .select()
            .from(customerSchemes)
            .where(and(eq(customerSchemes.accountNumber, accountNumber), eq(customerSchemes.organizationId, orgId)));

        if (existingAcc) {
            return res.status(409).json({
                success: false,
                error: `Scheme account number '${accountNumber}' already exists in this organization`,
            });
        }

        const maturityDate = new Date();
        maturityDate.setMonth(maturityDate.getMonth() + def.durationMonths);

        const [account] = await db
            .insert(customerSchemes)
            .values({
                organizationId: orgId,
                branchId,
                schemeId,
                customerId,
                accountNumber,
                maturityDate,
                status: 'ACTIVE',
            })
            .returning();

        EventBus.emit('CustomerEnrolledInScheme', {
            organizationId: orgId,
            branchId,
            schemeAccountId: account.id,
            accountNumber: account.accountNumber,
            timestamp: new Date(),
        });

        return res.status(201).json({ success: true, data: account });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Collect Installment
app.post('/api/v1/schemes/installments', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { schemeAccountId, installmentNo, dueDate, amountPaid, metalRateAtPayment, paymentMethodId, receiptNumber } = req.body;

        const [account] = await db
            .select()
            .from(customerSchemes)
            .where(and(eq(customerSchemes.id, schemeAccountId), eq(customerSchemes.organizationId, orgId)));

        if (!account) return res.status(404).json({ success: false, error: 'Customer scheme account not found in this organization' });

        const [existingInst] = await db
            .select()
            .from(schemeInstallments)
            .where(and(eq(schemeInstallments.schemeAccountId, schemeAccountId), eq(schemeInstallments.installmentNo, installmentNo)));

        if (existingInst) {
            return res.status(409).json({
                success: false,
                error: `Installment #${installmentNo} has already been collected for this scheme account`,
            });
        }

        let weightCredited = 0;
        if (metalRateAtPayment && parseFloat(metalRateAtPayment) > 0) {
            weightCredited = parseFloat(amountPaid) / parseFloat(metalRateAtPayment);
        }

        const [installment] = await db
            .insert(schemeInstallments)
            .values({
                schemeAccountId,
                installmentNo,
                dueDate: new Date(dueDate),
                paidDate: new Date(),
                amountPaid,
                metalRateAtPayment,
                weightCreditedGrams: weightCredited.toFixed(4),
                paymentMethodId,
                receiptNumber,
            })
            .returning();

        // Update totals on scheme account
        await db
            .update(customerSchemes)
            .set({
                totalAmountPaid: sql`${customerSchemes.totalAmountPaid} + ${amountPaid}`,
                totalWeightAccumulatedGrams: sql`${customerSchemes.totalWeightAccumulatedGrams} + ${weightCredited.toFixed(4)}`,
                updatedAt: new Date(),
            })
            .where(eq(customerSchemes.id, schemeAccountId));

        EventBus.emit('SchemeInstallmentPaid', {
            organizationId: orgId,
            schemeAccountId,
            installmentNo,
            amountPaid,
            timestamp: new Date(),
        });

        return res.status(201).json({ success: true, data: installment });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Redeem Scheme
app.post('/api/v1/schemes/redeem', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { schemeAccountId, invoiceId, redeemedAmount, redeemedWeightGrams, bonusRedeemedAmount } = req.body;

        const [account] = await db
            .select()
            .from(customerSchemes)
            .where(and(eq(customerSchemes.id, schemeAccountId), eq(customerSchemes.organizationId, orgId)));

        if (!account) return res.status(404).json({ success: false, error: 'Customer scheme account not found in this organization' });

        if (account.status === 'REDEEMED') {
            return res.status(400).json({
                success: false,
                error: 'Customer scheme account is already redeemed and cannot be used twice',
            });
        }

        if (account.status === 'CANCELLED') {
            return res.status(400).json({
                success: false,
                error: 'Cannot redeem a cancelled scheme account',
            });
        }

        const [redemption] = await db
            .insert(schemeRedemptions)
            .values({
                schemeAccountId,
                invoiceId,
                redeemedAmount,
                redeemedWeightGrams: redeemedWeightGrams || '0.0000',
                bonusRedeemedAmount: bonusRedeemedAmount || '0.00',
            })
            .returning();

        await db
            .update(customerSchemes)
            .set({ status: 'REDEEMED', updatedAt: new Date() })
            .where(eq(customerSchemes.id, schemeAccountId));

        EventBus.emit('SchemeRedeemed', {
            organizationId: orgId,
            schemeAccountId,
            invoiceId,
            redeemedAmount,
            timestamp: new Date(),
        });

        return res.status(201).json({ success: true, data: redemption });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Savings Scheme Service running on port ${PORT}`);
    });
}

export default app;
