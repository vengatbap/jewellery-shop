import { db } from '@auric-one/database';
import { roles, userRoles, rolePermissions } from '@auric-one/database/schema';

export class RoleManagementService {
    static async createRole(organizationId: string, name: string, description?: string): Promise<any> {
        const [role] = await db
            .insert(roles)
            .values({
                organizationId,
                name,
                description,
                isSystem: false,
            })
            .returning();
        return role;
    }

    static async assignRoleToUser(organizationId: string, userId: string, roleId: string): Promise<void> {
        await db
            .insert(userRoles)
            .values({
                organizationId,
                userId,
                roleId,
            });
    }

    static async assignPermissionToRole(roleId: string, permissionId: string): Promise<void> {
        await db
            .insert(rolePermissions)
            .values({
                roleId,
                permissionId,
            });
    }
}
