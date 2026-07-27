import { getExecutionContext } from '../context/execution-context';

export interface ApiResponseEnvelope<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Array<{ code: string; message: string; field?: string }>;
    meta: {
        requestId: string;
        timestamp: string;
        version: string;
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export function createSuccessResponse<T>(
    message: string,
    data: T,
    requestId: string,
    pagination?: ApiResponseEnvelope['meta']['pagination']
): ApiResponseEnvelope<T> {
    return {
        success: true,
        message,
        data,
        meta: {
            requestId,
            timestamp: new Date().toISOString(),
            version: 'v1',
            ...(pagination ? { pagination } : {})
        }
    };
}

export function createErrorResponse(
    message: string,
    errors: ApiResponseEnvelope['errors'],
    requestId: string
): ApiResponseEnvelope<null> {
    return {
        success: false,
        message,
        errors,
        meta: {
            requestId,
            timestamp: new Date().toISOString(),
            version: 'v1'
        }
    };
}

export class ApiResponse {
    static success<T>(data: T, message: string = 'Success', pagination?: any): ApiResponseEnvelope<T> {
        const context = getExecutionContext();
        const requestId = context?.requestId || 'N/A';
        return createSuccessResponse(message, data, requestId, pagination);
    }

    static error(message: string, code: string = 'INTERNAL_ERROR', _status: number = 500): ApiResponseEnvelope<null> {
        const context = getExecutionContext();
        const requestId = context?.requestId || 'N/A';
        return createErrorResponse(message, [{ code, message }], requestId);
    }
}
