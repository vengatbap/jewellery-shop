import { pgTable, varchar, uuid, index, boolean, decimal, jsonb } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext } from '../shared/index';

export const branchPosSettings = pgTable(
    'branch_pos_settings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        allowNegativeStock: boolean('allow_negative_stock').notNull().default(false),
        requireCustomerForBill: boolean('require_customer_for_bill').notNull().default(true),
        maxDiscountPercentage: decimal('max_discount_percentage', { precision: 5, scale: 2 }).notNull().default('5.00'),
        enableOfflineMode: boolean('enable_offline_mode').notNull().default(false),
        ...tenantContext(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxOrgBranch: index('idx_branch_pos_settings_org_branch').on(table.organizationId, table.branchId),
    })
);

export const branchInventorySettings = pgTable(
    'branch_inventory_settings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        enableAutoBarcode: boolean('enable_auto_barcode').notNull().default(true),
        defaultStorageLocation: varchar('default_storage_location', { length: 100 }),
        requireStockAudit: boolean('require_stock_audit').notNull().default(false),
        ...tenantContext(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxOrgBranch: index('idx_branch_inv_settings_org_branch').on(table.organizationId, table.branchId),
    })
);

export const branchAccountingSettings = pgTable(
    'branch_accounting_settings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        fiscalYearStartMonth: varchar('fiscal_year_start_month', { length: 20 }).notNull().default('APRIL'),
        currencyConversionEnabled: boolean('currency_conversion_enabled').notNull().default(false),
        defaultCashLedgerId: uuid('default_cash_ledger_id'),
        defaultBankLedgerId: uuid('default_bank_ledger_id'),
        ...tenantContext(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxOrgBranch: index('idx_branch_acc_settings_org_branch').on(table.organizationId, table.branchId),
    })
);

export const branchPricingSettings = pgTable(
    'branch_pricing_settings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        metalRateMargin: decimal('metal_rate_margin', { precision: 5, scale: 2 }).notNull().default('0.00'),
        wastageMultiplier: decimal('wastage_multiplier', { precision: 5, scale: 2 }).notNull().default('1.00'),
        makingChargeMarkup: decimal('making_charge_markup', { precision: 5, scale: 2 }).notNull().default('1.00'),
        ...tenantContext(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxOrgBranch: index('idx_branch_prc_settings_org_branch').on(table.organizationId, table.branchId),
    })
);

export const branchPrintingSettings = pgTable(
    'branch_printing_settings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        invoiceTemplateCode: varchar('invoice_template_code', { length: 50 }).notNull().default('STANDARD_A4'),
        barcodeTemplateCode: varchar('barcode_template_code', { length: 50 }).notNull().default('JEWEL_LABEL'),
        printerDeviceName: varchar('printer_device_name', { length: 255 }),
        ...tenantContext(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxOrgBranch: index('idx_branch_prn_settings_org_branch').on(table.organizationId, table.branchId),
    })
);

export const branchNotificationSettings = pgTable(
    'branch_notification_settings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        sendSmsOnBill: boolean('send_sms_on_bill').notNull().default(true),
        sendEmailOnBill: boolean('send_email_on_bill').notNull().default(true),
        smsProviderConfig: jsonb('sms_provider_config'),
        ...tenantContext(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxOrgBranch: index('idx_branch_ntf_settings_org_branch').on(table.organizationId, table.branchId),
    })
);

export type BranchPosSettings = typeof branchPosSettings.$inferSelect;
export type BranchInventorySettings = typeof branchInventorySettings.$inferSelect;
export type BranchAccountingSettings = typeof branchAccountingSettings.$inferSelect;
export type BranchPricingSettings = typeof branchPricingSettings.$inferSelect;
export type BranchPrintingSettings = typeof branchPrintingSettings.$inferSelect;
export type BranchNotificationSettings = typeof branchNotificationSettings.$inferSelect;
