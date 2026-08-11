import express, { type Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { db, pawnLoans, pawnItems, pawnPayments, pawnAuctions } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';
import { requireOrganization } from '@auric-one/platform';
import { EventBus } from '@auric-one/events';

const app: Application = express();
const PORT = process.env.GOLD_LOAN_SERVICE_PORT || 3012;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'gold-loan-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/pawn', requireOrganization);

// Get Gold Loans
app.get('/api/v1/pawn/loans', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const branchId = req.query.branchId as string | undefined;

        const conditions = [eq(pawnLoans.organizationId, orgId)];
        if (branchId) conditions.push(eq(pawnLoans.branchId, branchId));

        const list = await db
            .select()
            .from(pawnLoans)
            .where(and(...conditions))
            .limit(50);

        return res.json({ success: true, data: list });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create Gold Loan Pledge
app.post('/api/v1/pawn/loans', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { branchId, customerId, loanNumber, principalAmount, interestRateMonthlyPct, ltvPercentage, tenureMonths, items } = req.body;

        const [existingLoan] = await db
            .select()
            .from(pawnLoans)
            .where(and(eq(pawnLoans.loanNumber, loanNumber), eq(pawnLoans.organizationId, orgId)));

        if (existingLoan) {
            return res.status(409).json({
                success: false,
                error: `Gold loan '${loanNumber}' already exists in this organization (Idempotency Check)`,
            });
        }

        let totalAppraisedValue = 0;
        const calculatedItems = items.map((item: any) => {
            const itemVal = parseFloat(item.netWeightGrams) * parseFloat(item.appraisedValuePerGram);
            totalAppraisedValue += itemVal;
            return {
                ...item,
                totalAppraisedValue: itemVal.toFixed(2),
            };
        });

        const maxAllowedPrincipal = totalAppraisedValue * (parseFloat(ltvPercentage) / 100.0);
        if (parseFloat(principalAmount) > maxAllowedPrincipal) {
            return res.status(400).json({
                success: false,
                error: `Principal amount (${principalAmount}) exceeds LTV limit (${maxAllowedPrincipal.toFixed(2)}) based on appraised gold value (${totalAppraisedValue.toFixed(2)})`,
            });
        }

        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + (tenureMonths || 6));

        const [loan] = await db
            .insert(pawnLoans)
            .values({
                organizationId: orgId,
                branchId,
                customerId,
                loanNumber,
                principalAmount,
                interestRateMonthlyPct,
                ltvPercentage,
                appraisedGoldValue: totalAppraisedValue.toFixed(2),
                dueDate,
                status: 'ACTIVE',
                totalInterestPaid: '0.00',
                principalBalance: principalAmount,
            })
            .returning();

        const insertedItems = await Promise.all(
            calculatedItems.map((item: any) =>
                db.insert(pawnItems).values({ ...item, loanId: loan.id }).returning().then(r => r[0])
            )
        );

        EventBus.emit('GoldLoanDisbursed', {
            organizationId: orgId,
            branchId,
            loanId: loan.id,
            loanNumber: loan.loanNumber,
            principalAmount: loan.principalAmount,
            timestamp: new Date(),
        });

        return res.status(201).json({
            success: true,
            data: {
                ...loan,
                items: insertedItems,
            },
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Repay Interest / Principal
app.post('/api/v1/pawn/loans/:id/payments', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { paymentType, amountPaid, interestComponent, principalComponent, paymentMethodId, receiptNumber } = req.body;

        const [loan] = await db
            .select()
            .from(pawnLoans)
            .where(and(eq(pawnLoans.id, req.params.id), eq(pawnLoans.organizationId, orgId)));

        if (!loan) return res.status(404).json({ success: false, error: 'Gold loan not found in this organization' });

        const [payment] = await db
            .insert(pawnPayments)
            .values({
                loanId: req.params.id,
                paymentType,
                amountPaid,
                interestPaidComponent: interestComponent || '0.00',
                principalPaidComponent: principalComponent || '0.00',
                paymentMethodId,
                receiptNumber,
            })
            .returning();

        const newPrincipalBalance = Math.max(0, parseFloat(loan.principalBalance) - (parseFloat(principalComponent) || 0));
        const newStatus = newPrincipalBalance === 0 ? 'REPAID' : loan.status;

        await db
            .update(pawnLoans)
            .set({
                principalBalance: newPrincipalBalance.toFixed(2),
                totalInterestPaid: sql`${pawnLoans.totalInterestPaid} + ${(interestComponent || 0).toString()}`,
                status: newStatus,
                updatedAt: new Date(),
            })
            .where(and(eq(pawnLoans.id, req.params.id), eq(pawnLoans.organizationId, orgId)));

        EventBus.emit('GoldLoanPaymentReceived', {
            organizationId: orgId,
            loanId: req.params.id,
            amountPaid,
            timestamp: new Date(),
        });

        return res.status(201).json({ success: true, data: payment });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Foreclose Gold Loan
app.post('/api/v1/pawn/loans/:id/foreclose', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { auctionedPrice } = req.body;

        const [loan] = await db
            .select()
            .from(pawnLoans)
            .where(and(eq(pawnLoans.id, req.params.id), eq(pawnLoans.organizationId, orgId)));

        if (!loan) return res.status(404).json({ success: false, error: 'Gold loan not found in this organization' });

        if (loan.status === 'AUCTIONED' || loan.status === 'REPAID') {
            return res.status(400).json({
                success: false,
                error: `Cannot foreclose gold loan with status '${loan.status}'`,
            });
        }

        const surplus = Math.max(0, parseFloat(auctionedPrice) - parseFloat(loan.principalBalance));

        const [auction] = await db
            .insert(pawnAuctions)
            .values({
                loanId: req.params.id,
                auctionedPrice,
                surplusRefundToCustomer: surplus.toFixed(2),
                status: 'COMPLETED',
            })
            .returning();

        await db
            .update(pawnLoans)
            .set({ status: 'AUCTIONED', updatedAt: new Date() })
            .where(and(eq(pawnLoans.id, req.params.id), eq(pawnLoans.organizationId, orgId)));

        EventBus.emit('GoldLoanForeclosed', {
            organizationId: orgId,
            loanId: req.params.id,
            auctionedPrice,
            surplusRefund: surplus.toFixed(2),
            timestamp: new Date(),
        });

        return res.status(201).json({ success: true, data: auction });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Gold Loan / Pawn Service running on port ${PORT}`);
    });
}

export default app;
