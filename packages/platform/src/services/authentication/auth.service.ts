import { db } from '@auric-one/database';
import { users, userRoles, roles, sessions, authTokens } from '@auric-one/database/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { PasswordService } from '../identity/password.service.js';
import { TokenService } from './token.service.js';
import { generateRandomString } from '@auric-one/core';
import { SessionService } from './session.service.js';

export interface RegisterUserData {
    organizationId: string;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    roleName: string;
}

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    sessionId: string;
}

export class AuthService {
    static async register(data: RegisterUserData): Promise<string> {
        const password = data.password || generateRandomString(12);
        const passwordHash = await PasswordService.hashPassword(password);
        
        const [user] = await db
            .insert(users)
            .values({
                organizationId: data.organizationId,
                email: data.email.toLowerCase(),
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                status: 'ACTIVE',
            })
            .returning();
            
        const [roleRecord] = await db
            .select()
            .from(roles)
            .where(
                and(
                    eq(roles.organizationId, data.organizationId),
                    eq(roles.name, data.roleName)
                )
            );
            
        if (roleRecord) {
            await db
                .insert(userRoles)
                .values({
                    userId: user.id,
                    roleId: roleRecord.id,
                    organizationId: data.organizationId,
                });
        }
        
        return user.id;
    }

    static async login(
        email: string,
        password: string,
        ipAddress?: string,
        userAgent?: string,
        deviceName?: string,
        deviceId?: string
    ): Promise<LoginResult> {
        const [userRecord] = await db
            .select()
            .from(users)
            .where(
                and(
                    eq(users.email, email.toLowerCase()),
                    eq(users.status, 'ACTIVE')
                )
            );
            
        if (!userRecord) {
            throw new Error('Invalid email or password');
        }
        
        const isPasswordValid = await PasswordService.verifyPassword(password, userRecord.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        
        const userRolesRecords = await db
            .select()
            .from(userRoles)
            .where(
                and(
                    eq(userRoles.userId, userRecord.id),
                    isNull(userRoles.deletedAt)
                )
            );
            
        const roleIds = userRolesRecords.map((ur) => ur.roleId);
        
        const roleNames: string[] = [];
        for (const rId of roleIds) {
            const [role] = await db.select().from(roles).where(eq(roles.id, rId));
            if (role) {
                roleNames.push(role.name);
            }
        }
        
        const refreshTokenString = generateRandomString(64);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        
        const sessionId = await SessionService.createSession({
            userId: userRecord.id,
            organizationId: userRecord.organizationId,
            tokenString: refreshTokenString,
            ipAddress,
            userAgent,
            deviceName,
            deviceId,
            expiresAt,
            createdBy: userRecord.id,
        });
        
        const accessToken = TokenService.signAccessToken({
            sub: userRecord.id,
            org: userRecord.organizationId,
            sid: sessionId,
            roles: roleNames,
            permissions_version: 1,
        });
        
        const refreshToken = TokenService.signRefreshToken({
            sub: userRecord.id,
            sid: sessionId,
        });
        
        return {
            accessToken,
            refreshToken: `${refreshTokenString}:${refreshToken}`,
            sessionId,
        };
    }

    static async refresh(
        tokenString: string,
        jwtRefreshToken: string,
        ipAddress?: string,
        userAgent?: string
    ): Promise<LoginResult> {
        const decoded = TokenService.verifyRefreshToken(jwtRefreshToken);
        
        const session = await SessionService.verifySession(decoded.sub, tokenString);
        if (!session) {
            throw new Error('Invalid or expired refresh session');
        }
        
        const [userRecord] = await db
            .select()
            .from(users)
            .where(
                and(
                    eq(users.id, decoded.sub),
                    eq(users.status, 'ACTIVE')
                )
            );
            
        if (!userRecord) {
            throw new Error('User inactive or not found');
        }
        
        const userRolesRecords = await db
            .select()
            .from(userRoles)
            .where(
                and(
                    eq(userRoles.userId, userRecord.id),
                    isNull(userRoles.deletedAt)
                )
            );
            
        const roleIds = userRolesRecords.map((ur) => ur.roleId);
        const roleNames: string[] = [];
        for (const rId of roleIds) {
            const [role] = await db.select().from(roles).where(eq(roles.id, rId));
            if (role) {
                roleNames.push(role.name);
            }
        }
        
        const newRefreshTokenString = generateRandomString(64);
        const tokenHash = await PasswordService.hashPassword(newRefreshTokenString);
        
        await db
            .update(sessions)
            .set({
                ipAddress,
                userAgent,
                lastActivity: new Date(),
            })
            .where(eq(sessions.id, session.id));
            
        const [sessionDetails] = await db.select().from(sessions).where(eq(sessions.id, session.id));
        if (sessionDetails) {
            await db
                .update(authTokens)
                .set({
                    tokenHash,
                })
                .where(eq(authTokens.id, sessionDetails.refreshTokenId));
        }
            
        const accessToken = TokenService.signAccessToken({
            sub: userRecord.id,
            org: userRecord.organizationId,
            sid: session.id,
            roles: roleNames,
            permissions_version: 1,
        });
        
        const refreshToken = TokenService.signRefreshToken({
            sub: userRecord.id,
            sid: session.id,
        });
        
        return {
            accessToken,
            refreshToken: `${newRefreshTokenString}:${refreshToken}`,
            sessionId: session.id,
        };
    }

    static async logout(sessionId: string): Promise<void> {
        await SessionService.revokeSession(sessionId, 'User logout');
    }
}
