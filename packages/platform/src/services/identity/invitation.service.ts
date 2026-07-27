import { db } from '@auric-one/database';
import { users, authTokens } from '@auric-one/database/schema';
import { generateRandomString, hashString } from '@auric-one/core';
import { getNotificationProvider } from '@auric-one/notification';

export class InvitationService {
    static async inviteUser(organizationId: string, email: string, firstName?: string, lastName?: string): Promise<string> {
        const [pendingUser] = await db
            .insert(users)
            .values({
                organizationId,
                email: email.toLowerCase(),
                passwordHash: 'PENDING_INVITE',
                firstName,
                lastName,
                status: 'INACTIVE',
            })
            .returning();

        const tokenString = generateRandomString(32);
        const tokenHash = await hashString(tokenString);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await db
            .insert(authTokens)
            .values({
                tokenHash,
                tokenType: 'EMAIL_VERIFY',
                userId: pendingUser.id,
                expiresAt,
            });

        const notifier = getNotificationProvider();
        await notifier.send({
            to: email,
            channel: 'EMAIL',
            subject: 'Auric One ERP - Invitation',
            body: `You have been invited to join Auric One. Use token: ${tokenString} to complete setup.`,
        });

        return pendingUser.id;
    }
}
