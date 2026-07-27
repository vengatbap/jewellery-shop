// Domain Events
export type DomainEvent =
    | OrganizationCreatedEvent
    | OrganizationUpdatedEvent
    | BranchCreatedEvent
    | UserCreatedEvent
    | InvoiceCreatedEvent
    | InvoiceCompletedEvent
    | StockMovedEvent
    | JournalPostedEvent
    | CatalogChangedEvent;

export interface CatalogChangedEvent {
    type: 'CATALOG_CHANGED';
    entity: string; // e.g. "metals", "purities", "brands", etc.
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    organizationId?: string;
    payload: Record<string, any>;
    timestamp: Date;
    userId?: string;
}

// Organization Events
export interface OrganizationCreatedEvent {
    type: 'ORGANIZATION_CREATED';
    organizationId: string;
    name: string;
    timestamp: Date;
    userId: string;
}

export interface OrganizationUpdatedEvent {
    type: 'ORGANIZATION_UPDATED';
    organizationId: string;
    changes: Record<string, any>;
    timestamp: Date;
    userId: string;
}

// Branch Events
export interface BranchCreatedEvent {
    type: 'BRANCH_CREATED';
    branchId: string;
    organizationId: string;
    name: string;
    code: string;
    timestamp: Date;
    userId: string;
}

// User Events
export interface UserCreatedEvent {
    type: 'USER_CREATED';
    userId: string;
    organizationId: string;
    email: string;
    timestamp: Date;
}

// Billing Events
export interface InvoiceCreatedEvent {
    type: 'INVOICE_CREATED';
    invoiceId: string;
    organizationId: string;
    branchId: string;
    customerId: string;
    total: number;
    items: Array<{ id: string; quantity: number; price: number }>;
    timestamp: Date;
    userId: string;
}

export interface InvoiceCompletedEvent {
    type: 'INVOICE_COMPLETED';
    invoiceId: string;
    organizationId: string;
    branchId: string;
    total: number;
    timestamp: Date;
    userId: string;
}

// Inventory Events
export interface StockMovedEvent {
    type: 'STOCK_MOVED';
    organizationId: string;
    branchId: string;
    items: Array<{ itemId: string; quantity: number }>;
    reason: string;
    timestamp: Date;
    userId: string;
}

// Accounting Events
export interface JournalPostedEvent {
    type: 'JOURNAL_POSTED';
    organizationId: string;
    journalId: string;
    debit: number;
    credit: number;
    timestamp: Date;
    userId: string;
}
