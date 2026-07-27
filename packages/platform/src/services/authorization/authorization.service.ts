import { PermissionService } from '../rbac/permission.service';
import { PolicyService, PolicyContext } from '../rbac/policy.service';

export interface AuthorizeOptions {
    userId: string;
    organizationId: string;
    branchId?: string;
    roles: string[];
    requiredPermission: string;
    resourceOwnerId?: string;
}

export class AuthorizationService {
    static async authorize(options: AuthorizeOptions): Promise<boolean> {
        const hasPerm = await PermissionService.hasPermission(options.roles, options.requiredPermission);
        if (!hasPerm) {
            return false;
        }

        if (options.resourceOwnerId) {
            const context: PolicyContext = {
                userId: options.userId,
                organizationId: options.organizationId,
                branchId: options.branchId,
            };
            
            const isOwner = PolicyService.evaluateResourceOwner(context, options.resourceOwnerId);
            if (!isOwner) {
                const isTenantMatch = PolicyService.evaluateTenantMatch(context, options.organizationId);
                return isTenantMatch;
            }
        }

        return true;
    }
}
