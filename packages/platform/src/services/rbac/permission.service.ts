import { ROLE_PERMISSIONS } from '@auric-one/config';

export class PermissionService {
    static matchPermission(required: string, assigned: string): boolean {
        if (assigned === '*') return true;
        if (assigned === required) return true;
        
        if (assigned.endsWith(':*')) {
            const prefix = assigned.slice(0, -2);
            return required.startsWith(prefix + ':');
        }
        
        return false;
    }

    static async hasPermission(userRoles: string[], requiredPermission: string): Promise<boolean> {
        for (const roleName of userRoles) {
            const rolePermissionsList = ROLE_PERMISSIONS[roleName];
            if (rolePermissionsList) {
                for (const assignedPerm of rolePermissionsList) {
                    if (this.matchPermission(requiredPermission, assignedPerm)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
