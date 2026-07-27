// Organization Statuses
export const OrganizationStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    ARCHIVED: 'ARCHIVED',
} as const;

export type OrganizationStatus = (typeof OrganizationStatus)[keyof typeof OrganizationStatus];

// Branch Statuses
export const BranchStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
} as const;

export type BranchStatus = (typeof BranchStatus)[keyof typeof BranchStatus];

// User Statuses
export const UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// Inventory Statuses
export const InventoryStatus = {
    IN_STOCK: 'IN_STOCK',
    RESERVED: 'RESERVED',
    SOLD: 'SOLD',
    TRANSFERRED: 'TRANSFERRED',
    REPAIR: 'REPAIR',
    MELTING: 'MELTING',
    RETURNED: 'RETURNED',
} as const;

export type InventoryStatus = (typeof InventoryStatus)[keyof typeof InventoryStatus];

// Invoice Statuses
export const InvoiceStatus = {
    DRAFT: 'DRAFT',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

// Purchase Order Statuses
export const PurchaseOrderStatus = {
    DRAFT: 'DRAFT',
    ORDERED: 'ORDERED',
    PARTIAL: 'PARTIAL',
    RECEIVED: 'RECEIVED',
    CANCELLED: 'CANCELLED',
} as const;

export type PurchaseOrderStatus = (typeof PurchaseOrderStatus)[keyof typeof PurchaseOrderStatus];

// Payment Statuses
export const PaymentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
