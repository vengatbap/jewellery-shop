import { ProductRepository } from '../repositories/product.repository.js';
import { EventBus } from '@auric-one/events';

export class ProductService {
    private repo: ProductRepository;

    constructor() {
        this.repo = new ProductRepository();
    }

    async getTemplates(orgId: string, limit?: number, offset?: number) {
        return await this.repo.findTemplatesByOrganization(orgId, limit, offset);
    }

    async getTemplateById(orgId: string, templateId: string) {
        const template = await this.repo.findTemplateById(orgId, templateId);
        if (!template) throw new Error('Product Template not found');
        return template;
    }

    async createTemplate(orgId: string, payload: {
        templateCode: string;
        name: string;
        description?: string;
        categoryId?: string;
        brandId?: string;
        collectionId?: string;
        attributes?: Record<string, unknown>;
        metadata?: Record<string, unknown>;
    }) {
        const template = await this.repo.createTemplate({
            organizationId: orgId,
            templateCode: payload.templateCode,
            name: payload.name,
            description: payload.description,
            categoryId: payload.categoryId,
            brandId: payload.brandId,
            collectionId: payload.collectionId,
            attributes: payload.attributes || {},
            metadata: payload.metadata || {},
            status: 'DRAFT',
            version: 1,
            recordVersion: 1,
            isDeleted: false,
        });

        EventBus.emit('ProductCreated', {
            organizationId: orgId,
            templateId: template.id,
            templateCode: template.templateCode,
            timestamp: new Date(),
        });

        return template;
    }

    async updateTemplate(orgId: string, templateId: string, payload: {
        name?: string;
        description?: string;
        categoryId?: string;
        brandId?: string;
        collectionId?: string;
        status?: string;
        attributes?: Record<string, unknown>;
        expectedRecordVersion?: number;
    }) {
        const updated = await this.repo.updateTemplate(
            orgId,
            templateId,
            {
                name: payload.name,
                description: payload.description,
                categoryId: payload.categoryId,
                brandId: payload.brandId,
                collectionId: payload.collectionId,
                status: payload.status,
                attributes: payload.attributes,
            },
            payload.expectedRecordVersion
        );

        if (!updated) {
            throw new Error('Product Template update failed. Conflict or not found.');
        }

        EventBus.emit('ProductUpdated', {
            organizationId: orgId,
            templateId: updated.id,
            timestamp: new Date(),
        });

        return updated;
    }

    async createVariant(orgId: string, templateId: string, payload: {
        sku: string;
        variantName: string;
        metalId?: string;
        purityId?: string;
        grossWeight?: string;
        netWeight?: string;
        stoneWeight?: string;
        makingChargeValue?: string;
        wastagePercentage?: string;
    }) {
        // Verify template exists
        await this.getTemplateById(orgId, templateId);

        const variant = await this.repo.createVariant({
            organizationId: orgId,
            templateId: templateId,
            sku: payload.sku,
            variantName: payload.variantName,
            metalId: payload.metalId,
            purityId: payload.purityId,
            grossWeight: payload.grossWeight || '0.0000',
            netWeight: payload.netWeight || '0.0000',
            stoneWeight: payload.stoneWeight || '0.0000',
            makingChargeValue: payload.makingChargeValue || '0.00',
            wastagePercentage: payload.wastagePercentage || '0.00',
            status: 'ACTIVE',
            recordVersion: 1,
            isDeleted: false,
        });

        EventBus.emit('VariantCreated', {
            organizationId: orgId,
            templateId,
            variantId: variant.id,
            sku: variant.sku,
            timestamp: new Date(),
        });

        return variant;
    }
}
