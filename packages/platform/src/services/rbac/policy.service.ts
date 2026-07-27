export interface PolicyContext {
    userId: string;
    organizationId: string;
    branchId?: string;
}

export class PolicyService {
    static evaluateResourceOwner(context: PolicyContext, resourceOwnerId: string): boolean {
        return context.userId === resourceOwnerId;
    }

    static evaluateTenantMatch(context: PolicyContext, resourceTenantId: string): boolean {
        return context.organizationId === resourceTenantId;
    }
}
