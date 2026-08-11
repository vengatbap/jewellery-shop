import express, { type Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { db, onlineStores, onlineCart, onlineCartItems, onlineOrders } from '@auric-one/database';
import { eq, and } from 'drizzle-orm';
import { requireOrganization } from '@auric-one/platform';
import { EventBus } from '@auric-one/events';
import { v4 as uuidv4 } from 'uuid';

const app: Application = express();
const PORT = process.env.ECOMMERCE_SERVICE_PORT || 3014;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'ecommerce-service', timestamp: new Date().toISOString() });
});

app.use('/api/v1/commerce', requireOrganization);

// Get Store Config
app.get('/api/v1/commerce/stores', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const stores = await db
            .select()
            .from(onlineStores)
            .where(and(eq(onlineStores.organizationId, orgId), eq(onlineStores.isActive, true)));

        return res.json({ success: true, data: stores });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create Storefront
app.post('/api/v1/commerce/stores', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { storeCode, storeName, domain } = req.body;

        const [existingStore] = await db
            .select()
            .from(onlineStores)
            .where(and(eq(onlineStores.storeCode, storeCode), eq(onlineStores.organizationId, orgId)));

        if (existingStore) {
            return res.status(409).json({
                success: false,
                error: `Storefront with code '${storeCode}' already exists in this organization`,
            });
        }

        const [store] = await db
            .insert(onlineStores)
            .values({
                organizationId: orgId,
                storeCode,
                storeName,
                domain,
                isActive: true,
            })
            .returning();

        return res.status(201).json({ success: true, data: store });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create or Add to Cart
app.post('/api/v1/commerce/cart', async (req: Request, res: Response) => {
    try {
        const { cartToken, customerId, variantId, quantity, unitPrice } = req.body;

        let cartId: string;
        let token = cartToken;

        if (token) {
            const [existingCart] = await db.select().from(onlineCart).where(eq(onlineCart.cartToken, token));
            if (existingCart) {
                cartId = existingCart.id;
            } else {
                const [newCart] = await db.insert(onlineCart).values({ cartToken: token, customerId }).returning();
                cartId = newCart.id;
            }
        } else {
            token = uuidv4();
            const [newCart] = await db.insert(onlineCart).values({ cartToken: token, customerId }).returning();
            cartId = newCart.id;
        }

        const [item] = await db
            .insert(onlineCartItems)
            .values({
                cartId,
                variantId,
                quantity: quantity || 1,
                unitPrice,
            })
            .returning();

        return res.status(201).json({ success: true, data: { cartToken: token, item } });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Create E-Commerce Order
app.post('/api/v1/commerce/orders', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { storeId, customerId, orderNumber, subtotal, shippingFee, taxAmount, grandTotal, paymentGateway } = req.body;

        const [existingOrder] = await db
            .select()
            .from(onlineOrders)
            .where(and(eq(onlineOrders.orderNumber, orderNumber), eq(onlineOrders.organizationId, orgId)));

        if (existingOrder) {
            return res.status(409).json({
                success: false,
                error: `Online order '${orderNumber}' already exists in this organization (Idempotency Check)`,
                data: existingOrder,
            });
        }

        const [order] = await db
            .insert(onlineOrders)
            .values({
                organizationId: orgId,
                storeId,
                customerId,
                orderNumber,
                subtotal,
                shippingFee: shippingFee || '0.00',
                taxAmount: taxAmount || '0.00',
                grandTotal,
                paymentGateway, // BENEFIT_PAY | TAP | CHECKOUT_COM
                paymentStatus: 'PENDING',
                fulfillmentStatus: 'UNFULFILLED',
            })
            .returning();

        EventBus.emit('OnlineOrderCreated', {
            organizationId: orgId,
            storeId,
            orderId: order.id,
            orderNumber: order.orderNumber,
            grandTotal: order.grandTotal,
            timestamp: new Date(),
        });

        return res.status(201).json({
            success: true,
            data: {
                ...order,
                paymentRedirectUrl: `https://checkout.gateway.mock/pay?orderId=${order.id}&gateway=${paymentGateway}`,
            },
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

// Payment Gateway Webhook
app.post('/api/v1/commerce/webhooks/payment', async (req: Request, res: Response) => {
    try {
        const orgId = req.headers['x-organization-id'] as string;
        const { orderId, status } = req.body;

        const [existingOrder] = await db
            .select()
            .from(onlineOrders)
            .where(and(eq(onlineOrders.id, orderId), eq(onlineOrders.organizationId, orgId)));

        if (!existingOrder) {
            return res.status(404).json({ success: false, error: 'Online order not found' });
        }

        if (existingOrder.paymentStatus === 'PAID' && status === 'SUCCESS') {
            return res.json({
                success: true,
                message: 'Webhook event already processed (Idempotent)',
                data: existingOrder,
            });
        }

        const paymentStatus = status === 'SUCCESS' ? 'PAID' : 'FAILED';

        const [order] = await db
            .update(onlineOrders)
            .set({ paymentStatus, updatedAt: new Date() })
            .where(eq(onlineOrders.id, orderId))
            .returning();

        if (paymentStatus === 'PAID') {
            EventBus.emit('OnlineOrderPaid', {
                organizationId: orgId,
                orderId: order.id,
                orderNumber: order.orderNumber,
                timestamp: new Date(),
            });
        }

        return res.json({ success: true, data: order });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 E-Commerce Service running on port ${PORT}`);
    });
}

export default app;
