import { db } from '@auric-one/database';
import { sessions, authTokens } from '@auric-one/database/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { hashString, compareHash } from '@auric-one/core';

export interface CreateSessionOptions {
    userId: string;
    organizationId?: string;
    branchId?: string;
    tokenString: string;
    ipAddress?: string;
    userAgent?: string;
    deviceName?: string;
    deviceId?: string;
    expiresAt: Date;
    createdBy?: string;
}

export class SessionService {
    static async createSession(options: CreateSessionOptions): Promise<string> {
        const tokenHash = await hashString(options.tokenString);
        
        const [authTokenRecord] = await db
            .insert(authTokens)
            .values({
                tokenHash,
                tokenType: 'REFRESH',
                userId: options.userId,
                organizationId: options.organizationId,
                expiresAt: options.expiresAt,
            })
            .returning();

        const [sessionRecord] = await db
            .insert(sessions)
            .values({
                userId: options.userId,
                organizationId: options.organizationId,
                branchId: options.branchId,
                refreshTokenId: authTokenRecord.id,
                ipAddress: options.ipAddress,
                userAgent: options.userAgent,
                deviceName: options.deviceName,
                deviceId: options.deviceId,
                lastActivity: new Date(),
            })
            .returning();
            
        return sessionRecord.id;
    }

    static async verifySession(userId: string, tokenString: string): Promise<any> {
        const activeSessions = await db
            .select()
            .from(sessions)
            .where(
                and(
                    eq(sessions.userId, userId),
                    isNull(sessions.deletedAt),
                    isNull(sessions.revokedAt)
                )
            );
            
        for (const session of activeSessions) {
            const [tokenRecord] = await db
                .select()
                .from(authTokens)
                .where(
                    and(
                        eq(authTokens.id, session.refreshTokenId),
                        isNull(authTokens.deletedAt)
                    )
                );
                
            if (tokenRecord && tokenRecord.expiresAt > new Date()) {
                const isMatch = await compareHash(tokenString, tokenRecord.tokenHash);
                if (isMatch) {
                    await db
                        .update(sessions)
                        .set({ lastActivity: new Date() })
                        .where(eq(sessions.id, session.id));
                    return session;
                }
            }
        }
        
        return null;
    }

    static async revokeSession(sessionId: string, reason: string): Promise<void> {
        const [session] = await db
            .select()
            .from(sessions)
            .where(eq(sessions.id, sessionId));
            
        if (session) {
            await db
                .update(sessions)
                .set({
                    revokedAt: new Date(),
                    revokedReason: reason,
                })
                .where(eq(sessions.id, sessionId));
                
            await db
                .update(authTokens)
                .set({ deletedAt: new Date() })
                .where(eq(authTokens.id, session.refreshTokenId));
        }
    }

    static async revokeAllUserSessions(userId: string, reason: string): Promise<void> {
        const activeSessions = await db
            .select()
            .from(sessions)
            .where(
                and(
                    eq(sessions.userId, userId),
                    isNull(sessions.revokedAt)
                )
            );
            
        for (const session of activeSessions) {
            await this.revokeSession(session.id, reason);
        }
    }
}
