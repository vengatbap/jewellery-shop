import { ProcurementRepository } from '../repositories/procurement.repository.js';
import { EventBus } from '@auric-one/events';

export class ProcurementService {
    private repo: ProcurementRepository;

    constructor() {
        this.repo = new ProcurementRepository();
    }

    async getSuppliers(orgId: string, limit?: number, offset?: number) {
        return await this.repo.findSuppliers(orgId, limit, offset);
    }

    async createSupplier(orgId: string, payload: {
        supplierCode: string;
        name: string;
        contactPerson?: string;
        email?: string;
        phone?: string;
        taxId?: string;
        address?: string;
    }) {
        const existingCode = await this.repo.findSupplierByCode(orgId, payload.supplierCode);
        if (existingCode) {
            throw new Error(`Supplier with code '${payload.supplierCode}' already exists in this organization`);
        }

        const supplier = await this.repo.createSupplier({
            organizationId: orgId,
            supplierCode: payload.supplierCode,
            name: payload.name,
            contactPerson: payload.contactPerson,
            email: payload.email,
            phone: payload.phone,
            taxId: payload.taxId,
            address: payload.address,
            status: 'ACTIVE',
            balance: '0.00',
            isDeleted: false,
        });

        EventBus.emit('SupplierCreated', {
            organizationId: orgId,
            supplierId: supplier.id,
            supplierCode: supplier.supplierCode,
            timestamp: new Date(),
        });

        return supplier;
    }

    async getPurchaseOrders(orgId: string, branchId?: string, limit?: number, offset?: number) {
        return await this.repo.findPurchaseOrders(orgId, branchId, limit, offset);
    }

    async createPurchaseOrder(orgId: string, payload: {
        branchId: string;
        supplierId: string;
        poNumber: string;
        expectedDate?: Date;
        totalAmount: string;
        items: Array<{
            variantId?: string;
            description?: string;
            orderedQuantity: number;
            unitCost: string;
            totalCost: string;
        }>;
    }) {
        const supplier = await this.repo.findSupplierById(orgId, payload.supplierId);
        if (!supplier) {
            throw new Error('Supplier not found in this organization');
        }

        const existingPO = await this.repo.findPOByNumber(orgId, payload.poNumber);
        if (existingPO) {
            throw new Error(`Purchase Order '${payload.poNumber}' already exists in this organization`);
        }

        const po = await this.repo.createPurchaseOrder(
            {
                organizationId: orgId,
                branchId: payload.branchId,
                supplierId: payload.supplierId,
                poNumber: payload.poNumber,
                expectedDate: payload.expectedDate,
                totalAmount: payload.totalAmount,
                status: 'DRAFT',
            },
            payload.items
        );

        EventBus.emit('PurchaseOrderCreated', {
            organizationId: orgId,
            branchId: payload.branchId,
            poId: po.id,
            poNumber: po.poNumber,
            timestamp: new Date(),
        });

        return po;
    }

    async createGoodsReceiptNote(orgId: string, payload: {
        branchId: string;
        supplierId: string;
        poId?: string;
        grnNumber: string;
        receivedBy?: string;
        notes?: string;
    }) {
        const existingGRN = await this.repo.findGRNByNumber(orgId, payload.grnNumber);
        if (existingGRN) {
            throw new Error(`Goods Receipt Note '${payload.grnNumber}' already exists in this organization (Idempotency Check)`);
        }

        const supplier = await this.repo.findSupplierById(orgId, payload.supplierId);
        if (!supplier) {
            throw new Error('Supplier not found in this organization');
        }

        const grn = await this.repo.createGoodsReceiptNote({
            organizationId: orgId,
            branchId: payload.branchId,
            supplierId: payload.supplierId,
            poId: payload.poId,
            grnNumber: payload.grnNumber,
            receivedBy: payload.receivedBy,
            notes: payload.notes,
        });

        EventBus.emit('GoodsReceived', {
            organizationId: orgId,
            branchId: payload.branchId,
            grnId: grn.id,
            grnNumber: grn.grnNumber,
            timestamp: new Date(),
        });

        return grn;
    }

    async createSupplierPayment(orgId: string, payload: {
        supplierId: string;
        paymentNumber: string;
        paymentMethodId?: string;
        amount: string;
        referenceNo?: string;
        notes?: string;
    }) {
        const supplier = await this.repo.findSupplierById(orgId, payload.supplierId);
        if (!supplier) {
            throw new Error('Supplier not found in this organization');
        }

        const currentBalance = parseFloat(supplier.balance || '0.00');
        const paymentAmount = parseFloat(payload.amount);
        if (paymentAmount > currentBalance && currentBalance > 0) {
            throw new Error(`Supplier payment amount (${paymentAmount}) exceeds outstanding payable balance (${currentBalance})`);
        }

        const payment = await this.repo.createSupplierPayment({
            organizationId: orgId,
            supplierId: payload.supplierId,
            paymentNumber: payload.paymentNumber,
            paymentMethodId: payload.paymentMethodId,
            amount: payload.amount,
            referenceNo: payload.referenceNo,
            notes: payload.notes,
        });

        EventBus.emit('SupplierPaid', {
            organizationId: orgId,
            supplierId: payload.supplierId,
            paymentId: payment.id,
            amount: payment.amount,
            timestamp: new Date(),
        });

        return payment;
    }
}
