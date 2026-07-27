import {
    uuid,
    pgEnum,
} from 'drizzle-orm/pg-core';

export const primaryId = uuid('id').defaultRandom().primaryKey();

export const organizationId = uuid('organization_id').notNull();



// Status Enums
export const organizationStatusEnum = pgEnum('organization_status', [
    'ACTIVE',
    'SUSPENDED',
    'ARCHIVED',
]);

export const branchStatusEnum = pgEnum('branch_status', [
    'ACTIVE',
    'INACTIVE',
]);

export const userStatusEnum = pgEnum('user_status', [
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
]);

export const inventoryStatusEnum = pgEnum('inventory_status', [
    'IN_STOCK',
    'RESERVED',
    'SOLD',
    'TRANSFERRED',
    'REPAIR',
    'MELTING',
    'RETURNED',
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
    'DRAFT',
    'COMPLETED',
    'CANCELLED',
    'REFUNDED',
]);

export const purchaseOrderStatusEnum = pgEnum('purchase_order_status', [
    'DRAFT',
    'ORDERED',
    'PARTIAL',
    'RECEIVED',
    'CANCELLED',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
]);
