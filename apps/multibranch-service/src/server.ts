import express, { type Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { db, branchTransferShipments, branchTransferItems, regionalMetalRateOverrides, inventoryItems } from '@auric-one/database';
import { eq, and, inArray } from 'drizzle-orm';
import { requireOrganization } from '@auric-one/platform';
import { EventBus } from '@auric-one/events';

const app: Application = express();
const PORT = process.env.MULTIBRANCH_SERVICE_PORT || 3015;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'multibranch-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/multibranch', requireOrganization);

// Get Inter-Branch Transfers
app.get('/api/v1/multibranch/transfers', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const list = await db
            .select()
            .from(branchTransferShipments)
            .where(eq(branchTransferShipments.organizationId, orgId))
            .limit(50);

        return res.json({ success: true, data: list });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create Inter-Branch Shipment
app.post('/api/v1/multibranch/transfers', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { sourceBranchId, destinationBranchId, transferNumber, items } = req.body;

        if (sourceBranchId === destinationBranchId) {
            return res.status(400).json({
                success: false,
                error: 'Source and destination branches must be different',
            });
        }

        const [existingShipment] = await db
            .select()
            .from(branchTransferShipments)
            .where(and(eq(branchTransferShipments.transferNumber, transferNumber), eq(branchTransferShipments.organizationId, orgId)));

        if (existingShipment) {
            return res.status(409).json({
                success: false,
                error: `Transfer shipment number '${transferNumber}' already exists in this organization`,
            });
        }

        // Validate items eligibility
        const itemIds = items.map((i: any) => i.itemId).filter(Boolean);
        if (itemIds.length > 0) {
            const foundItems = await db
                .select()
                .from(inventoryItems)
                .where(and(inArray(inventoryItems.id, itemIds), eq(inventoryItems.organizationId, orgId)));

            for (const item of foundItems) {
                if (item.branchId !== sourceBranchId) {
                    return res.status(400).json({
                        success: false,
                        error: `Item '${item.itemTag || item.id}' does not belong to source branch`,
                    });
                }

                if (item.status !== 'IN_STOCK') {
                    return res.status(400).json({
                        success: false,
                        error: `Cannot transfer item '${item.itemTag || item.id}' with status '${item.status}'. Only IN_STOCK items can be transferred.`,
                    });
                }
            }
        }

        const [shipment] = await db
            .insert(branchTransferShipments)
            .values({
                organizationId: orgId,
                sourceBranchId,
                destinationBranchId,
                transferNumber,
                status: 'IN_TRANSIT',
                shippedAt: new Date(),
            })
            .returning();

        const insertedItems = await Promise.all(
            items.map((item: any) =>
                db.insert(branchTransferItems).values({ ...item, shipmentId: shipment.id }).returning().then(r => r[0])
            )
        );

        EventBus.emit('InterBranchShipmentDispatched', {
            organizationId: orgId,
            sourceBranchId,
            destinationBranchId,
            transferId: shipment.id,
            transferNumber: shipment.transferNumber,
            timestamp: new Date(),
        });

        return res.status(201).json({
            success: true,
            data: {
                ...shipment,
                items: insertedItems,
            },
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Receive Inter-Branch Shipment & Update Inventory Branch Ownership
app.post('/api/v1/multibranch/transfers/:id/receive', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;

        const [shipment] = await db
            .select()
            .from(branchTransferShipments)
            .where(and(eq(branchTransferShipments.id, req.params.id), eq(branchTransferShipments.organizationId, orgId)));

        if (!shipment) return res.status(404).json({ success: false, error: 'Shipment not found' });

        if (shipment.status === 'COMPLETED' || shipment.status === 'RECEIVED') {
            return res.status(400).json({
                success: false,
                error: 'Shipment has already been received and completed',
            });
        }

        const shipmentItems = await db
            .select()
            .from(branchTransferItems)
            .where(eq(branchTransferItems.shipmentId, shipment.id));

        // Reassign physical inventory items to destination branch
        await Promise.all(
            shipmentItems
                .filter(si => si.itemId)
                .map(si =>
                    db
                        .update(inventoryItems)
                        .set({ branchId: shipment.destinationBranchId, updatedAt: new Date() })
                        .where(eq(inventoryItems.id, si.itemId!))
                )
        );

        const [updatedShipment] = await db
            .update(branchTransferShipments)
            .set({ status: 'COMPLETED', receivedAt: new Date(), updatedAt: new Date() })
            .where(eq(branchTransferShipments.id, shipment.id))
            .returning();

        EventBus.emit('InterBranchShipmentReceived', {
            organizationId: orgId,
            destinationBranchId: shipment.destinationBranchId,
            transferId: shipment.id,
            timestamp: new Date(),
        });

        return res.json({ success: true, data: updatedShipment });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Set Regional Gold Rate Offset
app.post('/api/v1/multibranch/regional-rates', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { branchId, metalId, purityId, rateOffsetAmount } = req.body;

        const [override] = await db
            .insert(regionalMetalRateOverrides)
            .values({
                organizationId: orgId,
                branchId,
                metalId,
                purityId,
                rateOffsetAmount,
                effectiveAt: new Date(),
            })
            .returning();

        return res.status(201).json({ success: true, data: override });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Multi-Branch Service running on port ${PORT}`);
    });
}

export default app;
