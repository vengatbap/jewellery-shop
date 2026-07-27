// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Array<{ field?: string; code?: string; message: string }>;
    meta: {
        requestId: string;
        timestamp: string;
        version: string;
        pagination?: PaginationMeta;
    };
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Request Context (injected by middleware)
export interface RequestContext {
    userId: string;
    organizationId: string;
    branchId?: string;
    roles: string[];
    permissions: string[];
    ipAddress: string;
    userAgent: string;
}

// List Query Options
export interface ListQueryOptions {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    filters?: Record<string, any>;
}
