import { Request, Response } from 'express';
import { ProcurementService } from '../services/procurement.service.js';

export class ProcurementController {
    private service: ProcurementService;

    constructor() {
        this.service = new ProcurementService();
    }

    getSuppliers = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

            const result = await this.service.getSuppliers(orgId, limit, offset);
            return res.json({ success: true, data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    createSupplier = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const result = await this.service.createSupplier(orgId, req.body);
            return res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    getPurchaseOrders = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const branchId = req.query.branchId as string | undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

            const result = await this.service.getPurchaseOrders(orgId, branchId, limit, offset);
            return res.json({ success: true, data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    createPurchaseOrder = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const result = await this.service.createPurchaseOrder(orgId, req.body);
            return res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    createGoodsReceiptNote = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const result = await this.service.createGoodsReceiptNote(orgId, req.body);
            return res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    createSupplierPayment = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const result = await this.service.createSupplierPayment(orgId, req.body);
            return res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };
}
