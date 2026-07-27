import { db } from '@auric-one/database';
import {
    branchPosSettings,
    branchInventorySettings,
    branchAccountingSettings,
    branchPricingSettings,
    branchPrintingSettings,
    branchNotificationSettings
} from '@auric-one/database';
import { eq, and } from 'drizzle-orm';

export class BranchSettingsRepository {
    async getPosSettings(branchId: string, orgId: string) {
        const results = await db
            .select()
            .from(branchPosSettings)
            .where(and(eq(branchPosSettings.branchId, branchId), eq(branchPosSettings.organizationId, orgId)))
            .limit(1);
        return results[0] || null;
    }

    async upsertPosSettings(branchId: string, orgId: string, data: Partial<typeof branchPosSettings.$inferInsert>) {
        const existing = await this.getPosSettings(branchId, orgId);
        if (existing) {
            const results = await db
                .update(branchPosSettings)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(branchPosSettings.id, existing.id))
                .returning();
            return results[0];
        } else {
            const results = await db
                .insert(branchPosSettings)
                .values({ ...data, branchId, organizationId: orgId } as any)
                .returning();
            return results[0];
        }
    }

    async getInventorySettings(branchId: string, orgId: string) {
        const results = await db
            .select()
            .from(branchInventorySettings)
            .where(and(eq(branchInventorySettings.branchId, branchId), eq(branchInventorySettings.organizationId, orgId)))
            .limit(1);
        return results[0] || null;
    }

    async upsertInventorySettings(branchId: string, orgId: string, data: Partial<typeof branchInventorySettings.$inferInsert>) {
        const existing = await this.getInventorySettings(branchId, orgId);
        if (existing) {
            const results = await db
                .update(branchInventorySettings)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(branchInventorySettings.id, existing.id))
                .returning();
            return results[0];
        } else {
            const results = await db
                .insert(branchInventorySettings)
                .values({ ...data, branchId, organizationId: orgId } as any)
                .returning();
            return results[0];
        }
    }

    async getAccountingSettings(branchId: string, orgId: string) {
        const results = await db
            .select()
            .from(branchAccountingSettings)
            .where(and(eq(branchAccountingSettings.branchId, branchId), eq(branchAccountingSettings.organizationId, orgId)))
            .limit(1);
        return results[0] || null;
    }

    async upsertAccountingSettings(branchId: string, orgId: string, data: Partial<typeof branchAccountingSettings.$inferInsert>) {
        const existing = await this.getAccountingSettings(branchId, orgId);
        if (existing) {
            const results = await db
                .update(branchAccountingSettings)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(branchAccountingSettings.id, existing.id))
                .returning();
            return results[0];
        } else {
            const results = await db
                .insert(branchAccountingSettings)
                .values({ ...data, branchId, organizationId: orgId } as any)
                .returning();
            return results[0];
        }
    }

    async getPricingSettings(branchId: string, orgId: string) {
        const results = await db
            .select()
            .from(branchPricingSettings)
            .where(and(eq(branchPricingSettings.branchId, branchId), eq(branchPricingSettings.organizationId, orgId)))
            .limit(1);
        return results[0] || null;
    }

    async upsertPricingSettings(branchId: string, orgId: string, data: Partial<typeof branchPricingSettings.$inferInsert>) {
        const existing = await this.getPricingSettings(branchId, orgId);
        if (existing) {
            const results = await db
                .update(branchPricingSettings)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(branchPricingSettings.id, existing.id))
                .returning();
            return results[0];
        } else {
            const results = await db
                .insert(branchPricingSettings)
                .values({ ...data, branchId, organizationId: orgId } as any)
                .returning();
            return results[0];
        }
    }

    async getPrintingSettings(branchId: string, orgId: string) {
        const results = await db
            .select()
            .from(branchPrintingSettings)
            .where(and(eq(branchPrintingSettings.branchId, branchId), eq(branchPrintingSettings.organizationId, orgId)))
            .limit(1);
        return results[0] || null;
    }

    async upsertPrintingSettings(branchId: string, orgId: string, data: Partial<typeof branchPrintingSettings.$inferInsert>) {
        const existing = await this.getPrintingSettings(branchId, orgId);
        if (existing) {
            const results = await db
                .update(branchPrintingSettings)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(branchPrintingSettings.id, existing.id))
                .returning();
            return results[0];
        } else {
            const results = await db
                .insert(branchPrintingSettings)
                .values({ ...data, branchId, organizationId: orgId } as any)
                .returning();
            return results[0];
        }
    }

    async getNotificationSettings(branchId: string, orgId: string) {
        const results = await db
            .select()
            .from(branchNotificationSettings)
            .where(and(eq(branchNotificationSettings.branchId, branchId), eq(branchNotificationSettings.organizationId, orgId)))
            .limit(1);
        return results[0] || null;
    }

    async upsertNotificationSettings(branchId: string, orgId: string, data: Partial<typeof branchNotificationSettings.$inferInsert>) {
        const existing = await this.getNotificationSettings(branchId, orgId);
        if (existing) {
            const results = await db
                .update(branchNotificationSettings)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(branchNotificationSettings.id, existing.id))
                .returning();
            return results[0];
        } else {
            const results = await db
                .insert(branchNotificationSettings)
                .values({ ...data, branchId, organizationId: orgId } as any)
                .returning();
            return results[0];
        }
    }
}
