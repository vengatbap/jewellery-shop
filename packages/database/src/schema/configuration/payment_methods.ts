import { pgTable, uuid, index, boolean, decimal } from 'drizzle-orm/pg-core';
import { timestamps, softDelete, tenantContext, catalogColumns } from '../shared/index';

export const paymentMethods = pgTable(
    'payment_methods',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        isCash: boolean('is_cash').notNull().default(false),
        requiresReference: boolean('requires_reference').notNull().default(false),
        requiresApproval: boolean('requires_approval').notNull().default(false),
        requiresCustomer: boolean('requires_customer').notNull().default(false),
        supportsRefund: boolean('supports_refund').notNull().default(true),
        supportsExchange: boolean('supports_exchange').notNull().default(false),
        supportsInstallments: boolean('supports_installments').notNull().default(false),
        supportsPartialPayment: boolean('supports_partial_payment').notNull().default(true),
        supportsChange: boolean('supports_change').notNull().default(false),
        supportsOffline: boolean('supports_offline').notNull().default(true),
        supportsOnline: boolean('supports_online').notNull().default(true),
        requiresManagerApproval: boolean('requires_manager_approval').notNull().default(false),
        minAmount: decimal('min_amount', { precision: 15, scale: 4 }),
        maxAmount: decimal('max_amount', { precision: 15, scale: 4 }),
        defaultLedgerId: uuid('default_ledger_id'),
        ...tenantContext(),
        ...catalogColumns(),
        ...timestamps(),
        ...softDelete(),
    },
    (table) => ({
        idxCode: index('idx_payment_methods_code').on(table.code),
        idxOrg: index('idx_payment_methods_org').on(table.organizationId),
    })
);

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert;
