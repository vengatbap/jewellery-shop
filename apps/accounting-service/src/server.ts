import express, { type Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { db, chartOfAccounts, journalEntries, journalLines } from '@auric-one/database';
import { eq, and } from 'drizzle-orm';
import { requireOrganization } from '@auric-one/platform';
import { EventBus } from '@auric-one/events';
import { PostingEngine } from './posting-engine.js';

const app: Application = express();
const PORT = process.env.ACCOUNTING_SERVICE_PORT || 3009;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'accounting-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/accounting', requireOrganization);

// Get Chart of Accounts
app.get('/api/v1/accounting/accounts', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const accounts = await db
            .select()
            .from(chartOfAccounts)
            .where(and(eq(chartOfAccounts.organizationId, orgId), eq(chartOfAccounts.isActive, true)));

        return res.json({ success: true, data: accounts });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create Account in Chart of Accounts
app.post('/api/v1/accounting/accounts', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { accountCode, accountName, accountType, parentAccountId } = req.body;

        const [account] = await db
            .insert(chartOfAccounts)
            .values({
                organizationId: orgId,
                accountCode,
                accountName,
                accountType,
                parentAccountId,
                isActive: true,
            })
            .returning();

        EventBus.emit('AccountCreated', {
            organizationId: orgId,
            accountId: account.id,
            accountCode: account.accountCode,
            timestamp: new Date(),
        });

        return res.status(201).json({ success: true, data: account });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create Journal Voucher (Double-Entry)
app.post('/api/v1/accounting/journals', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { branchId, journalNumber, entryDate, narrative, lines } = req.body;

        const [existingJournal] = await db
            .select()
            .from(journalEntries)
            .where(and(eq(journalEntries.journalNumber, journalNumber), eq(journalEntries.organizationId, orgId)));

        if (existingJournal) {
            return res.status(409).json({
                success: false,
                error: `Journal voucher '${journalNumber}' already exists in this organization (Idempotency Check)`,
                data: existingJournal,
            });
        }

        // Validate double-entry debits === credits
        const totals = PostingEngine.validateDoubleEntry(lines);

        const [journal] = await db
            .insert(journalEntries)
            .values({
                organizationId: orgId,
                branchId,
                journalNumber,
                entryDate: entryDate ? new Date(entryDate) : new Date(),
                status: 'POSTED',
                narrative,
                totalDebit: totals.totalDebit.toString(),
                totalCredit: totals.totalCredit.toString(),
                postedAt: new Date(),
            })
            .returning();

        const insertedLines = await Promise.all(
            lines.map((line: any) =>
                db.insert(journalLines).values({
                    journalId: journal.id,
                    accountId: line.accountId,
                    debitAmount: (line.debitAmount || 0).toString(),
                    creditAmount: (line.creditAmount || 0).toString(),
                    memo: line.memo,
                }).returning().then(r => r[0])
            )
        );

        EventBus.emit('JournalPosted', {
            organizationId: orgId,
            branchId,
            journalId: journal.id,
            journalNumber: journal.journalNumber,
            totalDebit: journal.totalDebit,
            timestamp: new Date(),
        });

        return res.status(201).json({
            success: true,
            data: {
                ...journal,
                lines: insertedLines,
            },
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Trial Balance Report
app.get('/api/v1/accounting/reports/trial-balance', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const accounts = await db
            .select()
            .from(chartOfAccounts)
            .where(and(eq(chartOfAccounts.organizationId, orgId), eq(chartOfAccounts.isActive, true)));

        return res.json({
            success: true,
            data: {
                organizationId: orgId,
                asOfDate: new Date().toISOString(),
                accounts,
            },
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Accounting Service running on port ${PORT}`);
    });
}

export default app;
