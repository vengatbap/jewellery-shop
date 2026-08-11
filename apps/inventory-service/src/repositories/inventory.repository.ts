import { db, inventoryItems, stockMovements, stockTransfers, stockAdjustments, stockReservations } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';

export class InventoryRepository {
    async findItems(orgId: string, branchId?: string, status?: string, limit = 50, offset = 0) {
        const conditions = [
            eq(inventoryItems.organizationId, orgId),
            eq(inventoryItems.isDeleted, false),
        ];

        if (branchId) {
            conditions.push(eq(inventoryItems.branchId, branchId));
        }

        if (status) {
            conditions.push(eq(inventoryItems.status, status));
        }

        return await db
            .select()
            .from(inventoryItems)
            .where(and(...conditions))
            .limit(limit)
            .offset(offset);
    }

    async findItemById(orgId: string, itemId: string) {
        const [item] = await db
            .select()
            .from(inventoryItems)
            .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.organizationId, orgId), eq(inventoryItems.isDeleted, false)));

        if (!item) return null;

        const movements = await db
            .select()
            .from(stockMovements)
            .where(eq(stockMovements.itemId, itemId));

        return {
            ...item,
            movements,
        };
    }

    async findItemByBarcode(orgId: string, barcode: string) {
        const [item] = await db
            .select()
            .from(inventoryItems)
            .where(and(eq(inventoryItems.organizationId, orgId), eq(inventoryItems.barcode, barcode), eq(inventoryItems.isDeleted, false)));
        return item || null;
    }

    async findItemByTag(orgId: string, itemTag: string) {
        const [item] = await db
            .select()
            .from(inventoryItems)
            .where(and(eq(inventoryItems.organizationId, orgId), eq(inventoryItems.itemTag, itemTag), eq(inventoryItems.isDeleted, false)));
        return item || null;
    }

    async createItem(data: typeof inventoryItems.$inferInsert) {
        const [item] = await db.insert(inventoryItems).values(data).returning();
        return item;
    }

    async updateItemStatus(orgId: string, itemId: string, newStatus: string, expectedRecordVersion?: number) {
        const conditions = [
            eq(inventoryItems.id, itemId),
            eq(inventoryItems.organizationId, orgId),
            eq(inventoryItems.isDeleted, false),
        ];

        if (expectedRecordVersion !== undefined) {
            conditions.push(eq(inventoryItems.recordVersion, expectedRecordVersion));
        }

        const [updated] = await db
            .update(inventoryItems)
            .set({
                status: newStatus,
                recordVersion: sql`${inventoryItems.recordVersion} + 1`,
                updatedAt: new Date(),
            })
            .where(and(...conditions))
            .returning();

        return updated || null;
    }

    async createMovement(data: typeof stockMovements.$inferInsert) {
        const [movement] = await db.insert(stockMovements).values(data).returning();
        return movement;
    }

    async createTransfer(data: typeof stockTransfers.$inferInsert) {
        const [transfer] = await db.insert(stockTransfers).values(data).returning();
        return transfer;
    }

    async createAdjustment(data: typeof stockAdjustments.$inferInsert) {
        const [adjustment] = await db.insert(stockAdjustments).values(data).returning();
        return adjustment;
    }

    async createReservation(data: typeof stockReservations.$inferInsert) {
        const [reservation] = await db.insert(stockReservations).values(data).returning();
        return reservation;
    }
}
