import { AsyncLocalStorage } from 'async_hooks';

export interface ExecutionContext {
    requestId: string;
    correlationId: string;
    traceId: string;
    startedAt: Date;
    service: string;
    environment: string;
    hostname: string;
    organizationId?: string;
    branchId?: string;
    userId?: string;
    sessionId?: string;
    roleIds?: string[];
    locale?: string;
    timezone?: string;
    currency?: string;
}

export const executionContextStorage = new AsyncLocalStorage<ExecutionContext>();

export function getExecutionContext(): ExecutionContext | undefined {
    return executionContextStorage.getStore();
}

export function runWithContext<T>(context: ExecutionContext, callback: () => T): T {
    return executionContextStorage.run(context, callback);
}
