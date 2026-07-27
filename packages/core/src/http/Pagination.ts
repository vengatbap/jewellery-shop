export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationMetadata {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export function getPaginationMetadata(page: number, limit: number, total: number): PaginationMetadata {
    return {
        page: Math.max(1, page),
        limit: Math.max(1, limit),
        total: Math.max(0, total),
        totalPages: Math.ceil(Math.max(0, total) / Math.max(1, limit))
    };
}
