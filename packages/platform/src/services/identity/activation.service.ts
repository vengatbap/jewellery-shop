import { db } from '@auric-one/database';
import { users } from '@auric-one/database/schema';
import { eq } from 'drizzle-orm';

export class ActivationService {
    static async activateUser(userId: string): Promise<void> {
        await db
            .update(users)
            .set({ status: 'ACTIVE' })
            .where(eq(users.id, userId));
    }

    static async deactivateUser(userId: string): Promise<void> {
        await db
            .update(users)
            .set({ status: 'INACTIVE' })
            .where(eq(users.id, userId));
    }

    static async lockUser(userId: string): Promise<void> {
        await db
            .update(users)
            .set({ status: 'SUSPENDED' })
            .where(eq(users.id, userId));
    }

    static async unlockUser(userId: string): Promise<void> {
        await db
            .update(users)
            .set({ status: 'ACTIVE' })
            .where(eq(users.id, userId));
    }
}
