import { db, productTemplates, productVariants, productMetalCompositions, productStoneBreakdowns, productCertificates, productMedia } from '@auric-one/database';
import { eq, and, sql } from 'drizzle-orm';

export class ProductRepository {
    async findTemplatesByOrganization(orgId: string, limit = 50, offset = 0) {
        return await db
            .select()
            .from(productTemplates)
            .where(and(eq(productTemplates.organizationId, orgId), eq(productTemplates.isDeleted, false)))
            .limit(limit)
            .offset(offset);
    }

    async findTemplateById(orgId: string, templateId: string) {
        const [template] = await db
            .select()
            .from(productTemplates)
            .where(and(eq(productTemplates.id, templateId), eq(productTemplates.organizationId, orgId), eq(productTemplates.isDeleted, false)));
        if (!template) return null;

        const variants = await db
            .select()
            .from(productVariants)
            .where(and(eq(productVariants.templateId, templateId), eq(productVariants.isDeleted, false)));

        const media = await db
            .select()
            .from(productMedia)
            .where(eq(productMedia.templateId, templateId));

        return {
            ...template,
            variants,
            media,
        };
    }

    async createTemplate(data: typeof productTemplates.$inferInsert) {
        const [template] = await db.insert(productTemplates).values(data).returning();
        return template;
    }

    async updateTemplate(orgId: string, templateId: string, data: Partial<typeof productTemplates.$inferInsert>, expectedRecordVersion?: number) {
        const conditions = [
            eq(productTemplates.id, templateId),
            eq(productTemplates.organizationId, orgId),
            eq(productTemplates.isDeleted, false),
        ];

        if (expectedRecordVersion !== undefined) {
            conditions.push(eq(productTemplates.recordVersion, expectedRecordVersion));
        }

        const [updated] = await db
            .update(productTemplates)
            .set({
                ...data,
                recordVersion: sql`${productTemplates.recordVersion} + 1`,
                updatedAt: new Date(),
            })
            .where(and(...conditions))
            .returning();

        return updated || null;
    }

    async createVariant(data: typeof productVariants.$inferInsert) {
        const [variant] = await db.insert(productVariants).values(data).returning();
        return variant;
    }

    async findVariantById(orgId: string, variantId: string) {
        const [variant] = await db
            .select()
            .from(productVariants)
            .where(and(eq(productVariants.id, variantId), eq(productVariants.organizationId, orgId), eq(productVariants.isDeleted, false)));

        if (!variant) return null;

        const metalCompositions = await db
            .select()
            .from(productMetalCompositions)
            .where(eq(productMetalCompositions.variantId, variantId));

        const stones = await db
            .select()
            .from(productStoneBreakdowns)
            .where(eq(productStoneBreakdowns.variantId, variantId));

        const certificates = await db
            .select()
            .from(productCertificates)
            .where(eq(productCertificates.variantId, variantId));

        return {
            ...variant,
            metalCompositions,
            stones,
            certificates,
        };
    }
}
