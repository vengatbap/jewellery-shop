import { db } from '@auric-one/database';
import { users } from '@auric-one/database/schema';
import { eq, and } from 'drizzle-orm';

export interface UserDto {
    id: string;
    organizationId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export class UserService {
    static async getById(userId: string): Promise<UserDto | null> {
        const [record] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId));
            
        if (!record) return null;
        
        return {
            id: record.id,
            organizationId: record.organizationId,
            email: record.email,
            firstName: record.firstName || undefined,
            lastName: record.lastName || undefined,
            phone: record.phone || undefined,
            status: record.status as any,
        };
    }

    static async getByEmail(organizationId: string, email: string): Promise<UserDto | null> {
        const [record] = await db
            .select()
            .from(users)
            .where(
                and(
                    eq(users.organizationId, organizationId),
                    eq(users.email, email.toLowerCase())
                )
            );
            
        if (!record) return null;
        
        return {
            id: record.id,
            organizationId: record.organizationId,
            email: record.email,
            firstName: record.firstName || undefined,
            lastName: record.lastName || undefined,
            phone: record.phone || undefined,
            status: record.status as any,
        };
    }
}
