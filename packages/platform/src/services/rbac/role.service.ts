import { db } from '@auric-one/database';
import { userRoles, roles } from '@auric-one/database/schema';
import { eq, and, isNull } from 'drizzle-orm';

export class RoleService {
    static async getUserRoles(userId: string): Promise<string[]> {
        const assignments = await db
            .select()
            .from(userRoles)
            .where(
                and(
                    eq(userRoles.userId, userId),
                    isNull(userRoles.deletedAt)
                )
            );
            
        const roleNames: string[] = [];
        for (const record of assignments) {
            const [role] = await db
                .select()
                .from(roles)
                .where(eq(roles.id, record.roleId));
                
            if (role) {
                roleNames.push(role.name);
            }
        }
        
        return roleNames;
    }

    static async hasRole(userId: string, roleName: string): Promise<boolean> {
        const userRolesList = await this.getUserRoles(userId);
        return userRolesList.includes(roleName);
    }
}
