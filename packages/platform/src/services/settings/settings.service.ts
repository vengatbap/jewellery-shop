import { db } from '@auric-one/database';
import { invoiceSettings, goldRateSettings, barcodeSettings } from '@auric-one/database/schema';
import { eq, and, isNull } from 'drizzle-orm';

export class SettingsService {
    static async getInvoiceSettings(organizationId: string, branchId?: string): Promise<any> {
        if (branchId) {
            const [branchOverride] = await db
                .select()
                .from(invoiceSettings)
                .where(
                    and(
                        eq(invoiceSettings.organizationId, organizationId),
                        eq(invoiceSettings.branchId, branchId),
                        isNull(invoiceSettings.deletedAt)
                    )
                );
            if (branchOverride) return branchOverride;
        }

        const [orgDefaults] = await db
            .select()
            .from(invoiceSettings)
            .where(
                and(
                    eq(invoiceSettings.organizationId, organizationId),
                    isNull(invoiceSettings.branchId),
                    isNull(invoiceSettings.deletedAt)
                )
            );
            
        return orgDefaults || null;
    }

    static async updateInvoiceSettings(
        organizationId: string,
        branchId: string | null,
        data: { prefix?: string; suffix?: string; nextNumber?: number; taxEnabled?: boolean }
    ): Promise<void> {
        const query = branchId
            ? and(
                  eq(invoiceSettings.organizationId, organizationId),
                  eq(invoiceSettings.branchId, branchId),
                  isNull(invoiceSettings.deletedAt)
              )
            : and(
                  eq(invoiceSettings.organizationId, organizationId),
                  isNull(invoiceSettings.branchId),
                  isNull(invoiceSettings.deletedAt)
              );

        const [existing] = await db
            .select()
            .from(invoiceSettings)
            .where(query);

        if (existing) {
            await db
                .update(invoiceSettings)
                .set(data)
                .where(eq(invoiceSettings.id, existing.id));
        } else {
            await db
                .insert(invoiceSettings)
                .values({
                    organizationId,
                    branchId: branchId || undefined,
                    ...data,
                });
        }
    }

    static async getGoldRateSettings(organizationId: string, branchId?: string): Promise<any> {
        if (branchId) {
            const [branchOverride] = await db
                .select()
                .from(goldRateSettings)
                .where(
                    and(
                        eq(goldRateSettings.organizationId, organizationId),
                        eq(goldRateSettings.branchId, branchId),
                        isNull(goldRateSettings.deletedAt)
                    )
                );
            if (branchOverride) return branchOverride;
        }

        const [orgDefaults] = await db
            .select()
            .from(goldRateSettings)
            .where(
                and(
                    eq(goldRateSettings.organizationId, organizationId),
                    isNull(goldRateSettings.branchId),
                    isNull(goldRateSettings.deletedAt)
                )
            );
            
        return orgDefaults || null;
    }

    static async getBarcodeSettings(organizationId: string, branchId?: string): Promise<any> {
        if (branchId) {
            const [branchOverride] = await db
                .select()
                .from(barcodeSettings)
                .where(
                    and(
                        eq(barcodeSettings.organizationId, organizationId),
                        eq(barcodeSettings.branchId, branchId),
                        isNull(barcodeSettings.deletedAt)
                    )
                );
            if (branchOverride) return branchOverride;
        }

        const [orgDefaults] = await db
            .select()
            .from(barcodeSettings)
            .where(
                and(
                    eq(barcodeSettings.organizationId, organizationId),
                    isNull(barcodeSettings.branchId),
                    isNull(barcodeSettings.deletedAt)
                )
            );
            
        return orgDefaults || null;
    }
}
