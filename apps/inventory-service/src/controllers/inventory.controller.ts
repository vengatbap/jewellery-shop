import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service.js';

export class InventoryController {
    private service: InventoryService;

    constructor() {
        this.service = new InventoryService();
    }

    getItems = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const branchId = req.query.branchId as string | undefined;
            const status = req.query.status as string | undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

            const items = await this.service.getItems(orgId, branchId, status, limit, offset);
            return res.json({ success: true, data: items });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    getItemById = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const item = await this.service.getItemById(orgId, req.params.id);
            return res.json({ success: true, data: item });
        } catch (error: any) {
            return res.status(404).json({ success: false, error: error.message });
        }
    };

    tagItem = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const item = await this.service.tagItem(orgId, req.body);
            return res.status(201).json({ success: true, data: item });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    recordMovement = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const movement = await this.service.recordMovement(orgId, req.body);
            return res.status(201).json({ success: true, data: movement });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    returnItem = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const item = await this.service.returnItem(orgId, req.params.id, req.body?.reason);
            return res.json({ success: true, message: 'Item returned to stock successfully', data: item });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };
}
