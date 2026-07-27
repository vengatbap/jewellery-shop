import { db } from '@auric-one/database';
import { authTokens, users } from '@auric-one/database/schema';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { generateRandomString, hashString, compareHash } from '@auric-one/core';
import { PasswordService } from './password.service';

export class RecoveryService {
    static async generateRecoveryToken(userId: string): Promise<string> {
        const tokenString = generateRandomString(32);
        const tokenHash = await hashString(tokenString);
        
        // Expiry in 1 hour
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        
        await db
            .insert(authTokens)
            .values({
                tokenHash,
                tokenType: 'PASSWORD_RESET',
                userId,
                expiresAt,
            });
            
        return tokenString;
    }

    static async resetPasswordWithToken(userId: string, tokenString: string, newPassword: string): Promise<boolean> {
        const activeTokens = await db
            .select()
            .from(authTokens)
            .where(
                and(
                    eq(authTokens.userId, userId),
                    eq(authTokens.tokenType, 'PASSWORD_RESET'),
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
                
                const passwordHash = await PasswordService.hashPassword(newPassword);
                await db
                    .update(users)
                    .set({ passwordHash })
                    .where(eq(users.id, userId));
                    
                return true;
            }
        }
        
        return false;
    }
}
