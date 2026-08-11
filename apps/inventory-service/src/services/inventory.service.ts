import { InventoryRepository } from '../repositories/inventory.repository.js';
import { EventBus } from '@auric-one/events';

export class InventoryService {
    private repo: InventoryRepository;

    constructor() {
        this.repo = new InventoryRepository();
    }

    async getItems(orgId: string, branchId?: string, status?: string, limit?: number, offset?: number) {
        return await this.repo.findItems(orgId, branchId, status, limit, offset);
    }

    async getItemById(orgId: string, itemId: string) {
        const item = await this.repo.findItemById(orgId, itemId);
        if (!item) throw new Error('Inventory Item not found');
        return item;
    }

    async tagItem(orgId: string, payload: {
        branchId: string;
        variantId: string;
        itemTag: string;
        barcode: string;
        grossWeight: string;
        netWeight: string;
        stoneWeight?: string;
        costPrice?: string;
        sellingPriceOverride?: string;
        attributes?: Record<string, unknown>;
    }) {
        // Check for duplicate barcode or item tag within the organization
        const existingBarcode = await this.repo.findItemByBarcode(orgId, payload.barcode);
        if (existingBarcode) {
            throw new Error(`Inventory item with barcode '${payload.barcode}' already exists in this organization`);
        }

        const existingTag = await this.repo.findItemByTag(orgId, payload.itemTag);
        if (existingTag) {
            throw new Error(`Inventory item with tag '${payload.itemTag}' already exists in this organization`);
        }

        const item = await this.repo.createItem({
            organizationId: orgId,
            branchId: payload.branchId,
            variantId: payload.variantId,
            itemTag: payload.itemTag,
            barcode: payload.barcode,
            grossWeight: payload.grossWeight,
            netWeight: payload.netWeight,
            stoneWeight: payload.stoneWeight || '0.0000',
            costPrice: payload.costPrice,
            sellingPriceOverride: payload.sellingPriceOverride,
            status: 'IN_STOCK',
            recordVersion: 1,
            attributes: payload.attributes || {},
            isDeleted: false,
        });

        // Record opening stock movement
        await this.repo.createMovement({
            organizationId: orgId,
            itemId: item.id,
            movementType: 'OPENING_STOCK',
            toBranchId: payload.branchId,
            quantity: 1,
            weight: item.grossWeight,
        });

        EventBus.emit('ItemTagged', {
            organizationId: orgId,
            branchId: payload.branchId,
            itemId: item.id,
            itemTag: item.itemTag,
            barcode: item.barcode,
            timestamp: new Date(),
        });

        return item;
    }

    async recordMovement(orgId: string, payload: {
        itemId: string;
        movementType: string;
        fromBranchId?: string;
        toBranchId?: string;
        quantity?: number;
        weight: string;
        referenceType?: string;
        referenceId?: string;
    }) {
        const item = await this.getItemById(orgId, payload.itemId);

        const movement = await this.repo.createMovement({
            organizationId: orgId,
            itemId: payload.itemId,
            movementType: payload.movementType,
            fromBranchId: payload.fromBranchId,
            toBranchId: payload.toBranchId,
            quantity: payload.quantity || 1,
            weight: payload.weight,
            referenceType: payload.referenceType,
            referenceId: payload.referenceId,
        });

        EventBus.emit('StockMoved', {
            organizationId: orgId,
            itemId: item.id,
            movementType: payload.movementType,
            timestamp: new Date(),
        });

        return movement;
    }

    async returnItem(orgId: string, itemId: string, reason?: string) {
        const item = await this.getItemById(orgId, itemId);
        if (item.status !== 'SOLD') {
            throw new Error(`Cannot return item with status '${item.status}'. Only SOLD items can be returned.`);
        }

        const updated = await this.repo.updateItemStatus(orgId, itemId, 'IN_STOCK', item.recordVersion);
        if (!updated) {
            throw new Error('Failed to update item status. Version conflict or item not found.');
        }

        await this.repo.createMovement({
            organizationId: orgId,
            itemId: item.id,
            movementType: 'RETURN_RESTOCK',
            toBranchId: item.branchId,
            quantity: 1,
            weight: item.grossWeight,
            referenceType: 'RETURN',
            referenceId: reason || 'Customer Return',
        });

        EventBus.emit('StockMoved', {
            organizationId: orgId,
            itemId: item.id,
            movementType: 'RETURN_RESTOCK',
            timestamp: new Date(),
        });

        return updated;
    }
}
