import { db } from '@auric-one/database';
import { authTokens } from '@auric-one/database/schema';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { generateRandomString, hashString, compareHash } from '@auric-one/core';

export class VerificationService {
    static async generateEmailVerificationToken(userId: string): Promise<string> {
        const tokenString = generateRandomString(32);
        const tokenHash = await hashString(tokenString);
        
        // Expiry in 24 hours
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        await db
            .insert(authTokens)
            .values({
                tokenHash,
                tokenType: 'EMAIL_VERIFY',
                userId,
                expiresAt,
            });
            
        return tokenString;
    }

    static async verifyEmailToken(userId: string, tokenString: string): Promise<boolean> {
        const activeTokens = await db
            .select()
            .from(authTokens)
            .where(
                and(
                    eq(authTokens.userId, userId),
                    eq(authTokens.tokenType, 'EMAIL_VERIFY'),
                    isNull(authTokens.deletedAt),
                    gt(authTokens.expiresAt, new Date())
                )
            );
            
        for (const tokenRecord of activeTokens) {
            const isMatch = await compareHash(tokenString, tokenRecord.tokenHash);
            if (isMatch) {
                await db
                    .update(authTokens)
                    .set({ deletedAt: new Date() })
                    .where(eq(authTokens.id, tokenRecord.id));
                return true;
            }
        }
        
        return false;
    }
}
