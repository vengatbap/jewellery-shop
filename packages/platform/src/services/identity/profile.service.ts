import { db } from '@auric-one/database';
import { users } from '@auric-one/database/schema';
import { eq } from 'drizzle-orm';

export interface UpdateProfileOptions {
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export class ProfileService {
    static async updateProfile(userId: string, options: UpdateProfileOptions): Promise<void> {
        await db
            .update(users)
            .set({
                firstName: options.firstName,
                lastName: options.lastName,
                phone: options.phone,
            })
            .where(eq(users.id, userId));
    }
}
