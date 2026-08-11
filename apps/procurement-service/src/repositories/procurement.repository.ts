import { db, suppliers, purchaseOrders, purchaseOrderItems, goodsReceiptNotes, supplierPayments } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';

export class ProcurementRepository {
    async findSuppliers(orgId: string, limit = 50, offset = 0) {
        return await db
            .select()
            .from(suppliers)
            .where(and(eq(suppliers.organizationId, orgId), eq(suppliers.isDeleted, false)))
            .limit(limit)
            .offset(offset);
    }

    async findSupplierById(orgId: string, supplierId: string) {
        const [supplier] = await db
            .select()
            .from(suppliers)
            .where(and(eq(suppliers.id, supplierId), eq(suppliers.organizationId, orgId), eq(suppliers.isDeleted, false)));
        return supplier || null;
    }

    async findSupplierByCode(orgId: string, supplierCode: string) {
        const [supplier] = await db
            .select()
            .from(suppliers)
            .where(and(eq(suppliers.supplierCode, supplierCode), eq(suppliers.organizationId, orgId), eq(suppliers.isDeleted, false)));
        return supplier || null;
    }

    async findPOByNumber(orgId: string, poNumber: string) {
        const [po] = await db
            .select()
            .from(purchaseOrders)
            .where(and(eq(purchaseOrders.poNumber, poNumber), eq(purchaseOrders.organizationId, orgId)));
        return po || null;
    }

    async findGRNByNumber(orgId: string, grnNumber: string) {
        const [grn] = await db
            .select()
            .from(goodsReceiptNotes)
            .where(and(eq(goodsReceiptNotes.grnNumber, grnNumber), eq(goodsReceiptNotes.organizationId, orgId)));
        return grn || null;
    }

    async createSupplier(data: typeof suppliers.$inferInsert) {
        const [supplier] = await db.insert(suppliers).values(data).returning();
        return supplier;
    }

    async findPurchaseOrders(orgId: string, branchId?: string, limit = 50, offset = 0) {
        const conditions = [eq(purchaseOrders.organizationId, orgId)];
        if (branchId) conditions.push(eq(purchaseOrders.branchId, branchId));

        return await db
            .select()
            .from(purchaseOrders)
            .where(and(...conditions))
            .limit(limit)
            .offset(offset);
    }

    async createPurchaseOrder(poData: typeof purchaseOrders.$inferInsert, items: Array<Omit<typeof purchaseOrderItems.$inferInsert, 'poId'>>) {
        const [po] = await db.insert(purchaseOrders).values(poData).returning();

        const poItems = await Promise.all(
            items.map(item => db.insert(purchaseOrderItems).values({ ...item, poId: po.id }).returning().then(res => res[0]))
        );

        return { ...po, items: poItems };
    }

    async createGoodsReceiptNote(data: typeof goodsReceiptNotes.$inferInsert) {
        const [grn] = await db.insert(goodsReceiptNotes).values(data).returning();
        return grn;
    }

    async createSupplierPayment(data: typeof supplierPayments.$inferInsert) {
        const [payment] = await db.insert(supplierPayments).values(data).returning();
        
        // Update supplier balance
        await db
            .update(suppliers)
            .set({
                balance: sql`${suppliers.balance} - ${data.amount}`,
                updatedAt: new Date(),
            })
            .where(eq(suppliers.id, data.supplierId));

        return payment;
    }
}
