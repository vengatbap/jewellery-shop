import { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';

export class ProductController {
    private service: ProductService;

    constructor() {
        this.service = new ProductService();
    }

    getTemplates = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const templates = await this.service.getTemplates(orgId, limit, offset);
            return res.json({ success: true, data: templates });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    getTemplateById = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const template = await this.service.getTemplateById(orgId, req.params.id);
            return res.json({ success: true, data: template });
        } catch (error: any) {
            return res.status(404).json({ success: false, error: error.message });
        }
    };

    createTemplate = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const template = await this.service.createTemplate(orgId, req.body);
            return res.status(201).json({ success: true, data: template });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    updateTemplate = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const updated = await this.service.updateTemplate(orgId, req.params.id, req.body);
            return res.json({ success: true, data: updated });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };

    createVariant = async (req: Request, res: Response) => {
        try {
            const orgId = req.headers['x-organization-id'] as string;
            const variant = await this.service.createVariant(orgId, req.params.id, req.body);
            return res.status(201).json({ success: true, data: variant });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    };
}
