import express, { type Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { db, customerProfiles, customerKycDocuments, customerLoyaltyTransactions } from '@auric-one/database';
import { eq, and } from 'drizzle-orm';
import { requireOrganization } from '@auric-one/platform';
import { EventBus } from '@auric-one/events';

const app: Application = express();
const PORT = process.env.CUSTOMER_SERVICE_PORT || 3011;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'customer-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/customers', requireOrganization);

// Get Customer List
app.get('/api/v1/customers', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const list = await db
            .select()
            .from(customerProfiles)
            .where(and(eq(customerProfiles.organizationId, orgId), eq(customerProfiles.isDeleted, false)))
            .limit(50);

        return res.json({ success: true, data: list });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Get Single Customer Profile with KYC
app.get('/api/v1/customers/:id', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const [customer] = await db
            .select()
            .from(customerProfiles)
            .where(and(eq(customerProfiles.id, req.params.id), eq(customerProfiles.organizationId, orgId), eq(customerProfiles.isDeleted, false)));

        if (!customer) {
            return res.status(404).json({ success: false, error: 'Customer profile not found' });
        }

        const kycDocs = await db
            .select()
            .from(customerKycDocuments)
            .where(eq(customerKycDocuments.customerId, customer.id));

        return res.json({
            success: true,
            data: {
                ...customer,
                kycDocuments: kycDocs,
            },
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create Customer Profile
app.post('/api/v1/customers', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { customerCode, firstName, lastName, email, phone, cprCivilId, vipTier, address } = req.body;

        const [existingCode] = await db
            .select()
            .from(customerProfiles)
            .where(and(eq(customerProfiles.customerCode, customerCode), eq(customerProfiles.organizationId, orgId), eq(customerProfiles.isDeleted, false)));

        if (existingCode) {
            return res.status(409).json({
                success: false,
                error: `Customer with code '${customerCode}' already exists in this organization`,
            });
        }

        if (cprCivilId) {
            const [existingCpr] = await db
                .select()
                .from(customerProfiles)
                .where(and(eq(customerProfiles.cprCivilId, cprCivilId), eq(customerProfiles.organizationId, orgId), eq(customerProfiles.isDeleted, false)));

            if (existingCpr) {
                return res.status(409).json({
                    success: false,
                    error: `Customer with National ID / CPR '${cprCivilId}' already exists in this organization`,
                });
            }
        }

        const [profile] = await db
            .insert(customerProfiles)
            .values({
                organizationId: orgId,
                customerCode,
                firstName,
                lastName,
                email,
                phone,
                cprCivilId,
                vipTier: vipTier || 'STANDARD',
                address,
                loyaltyPointsBalance: 0,
                status: 'ACTIVE',
                isDeleted: false,
            })
            .returning();

        EventBus.emit('CustomerCreated', {
            organizationId: orgId,
            customerId: profile.id,
            customerCode: profile.customerCode,
            timestamp: new Date(),
        });

        return res.status(201).json({ success: true, data: profile });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Upload KYC Document
app.post('/api/v1/customers/:id/kyc', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { documentType, documentNumber, expiryDate, mediaUrl } = req.body;

        const [customer] = await db
            .select()
            .from(customerProfiles)
            .where(and(eq(customerProfiles.id, req.params.id), eq(customerProfiles.organizationId, orgId), eq(customerProfiles.isDeleted, false)));

        if (!customer) {
            return res.status(404).json({ success: false, error: 'Customer profile not found in this organization' });
        }

        const [doc] = await db
            .insert(customerKycDocuments)
            .values({
                customerId: req.params.id,
                documentType,
                documentNumber,
                expiryDate: expiryDate ? new Date(expiryDate) : undefined,
                mediaUrl,
                verificationStatus: 'VERIFIED',
                verifiedAt: new Date(),
            })
            .returning();

        EventBus.emit('KycVerified', {
            organizationId: orgId,
            customerId: req.params.id,
            documentId: doc.id,
            documentType,
            timestamp: new Date(),
        });

        return res.status(201).json({ success: true, data: doc });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Add / Redeem Loyalty Points
app.post('/api/v1/customers/:id/loyalty', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { pointsEarned, pointsRedeemed, description, invoiceId } = req.body;

        const [customer] = await db
            .select()
            .from(customerProfiles)
            .where(and(eq(customerProfiles.id, req.params.id), eq(customerProfiles.organizationId, orgId), eq(customerProfiles.isDeleted, false)));

        if (!customer) return res.status(404).json({ success: false, error: 'Customer profile not found in this organization' });

        const netPoints = (pointsEarned || 0) - (pointsRedeemed || 0);
        const newBalance = customer.loyaltyPointsBalance + netPoints;

        if (newBalance < 0) {
            return res.status(400).json({ success: false, error: 'Insufficient loyalty points balance' });
        }

        const [tx] = await db
            .insert(customerLoyaltyTransactions)
            .values({
                customerId: req.params.id,
                invoiceId,
                pointsEarned: pointsEarned || 0,
                pointsRedeemed: pointsRedeemed || 0,
                balanceAfter: newBalance,
                description,
            })
            .returning();

        await db
            .update(customerProfiles)
            .set({ loyaltyPointsBalance: newBalance, updatedAt: new Date() })
            .where(eq(customerProfiles.id, req.params.id));

        EventBus.emit('LoyaltyPointsUpdated', {
            customerId: req.params.id,
            newBalance,
            timestamp: new Date(),
        });

        return res.status(201).json({ success: true, data: tx });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Customer/CRM Service running on port ${PORT}`);
    });
}

export default app;
