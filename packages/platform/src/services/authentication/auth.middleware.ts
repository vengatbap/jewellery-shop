import { Request, Response, NextFunction } from 'express';
import { getExecutionContext, AuthenticationError, AuthorizationError } from '@auric-one/core';
import { TokenService } from './token.service.js';
import { db } from '@auric-one/database';
import { sessions } from '@auric-one/database/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { AuthorizationService } from '../authorization/authorization.service.js';

export function requirePermission(permissionCode: string) {
    return async (_req: Request, _res: Response, next: NextFunction) => {
        try {
            const context = getExecutionContext();
            if (!context || !context.userId || !context.organizationId) {
                throw new AuthenticationError('User authentication required');
            }

            const hasAccess = await AuthorizationService.authorize({
                userId: context.userId,
                organizationId: context.organizationId,
                branchId: context.branchId,
                roles: context.roleIds || [],
                requiredPermission: permissionCode,
            });

            if (!hasAccess) {
                throw new AuthorizationError(`Insufficient permissions. Required: ${permissionCode}`);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('Missing or malformed Authorization header');
        }

        const token = authHeader.substring(7);
        let decoded;
        try {
            decoded = TokenService.verifyAccessToken(token);
        } catch (err) {
            throw new AuthenticationError('Invalid or expired access token');
        }

        const [session] = await db
            .select()
            .from(sessions)
            .where(
                and(
                    eq(sessions.id, decoded.sid),
                    isNull(sessions.revokedAt),
                    isNull(sessions.deletedAt)
                )
            );

        if (!session) {
            throw new AuthenticationError('Session has been revoked or expired');
        }

        const context = getExecutionContext();
        if (context) {
            context.userId = decoded.sub;
            context.organizationId = decoded.org;
            context.branchId = decoded.branch;
            context.sessionId = decoded.sid;
            context.roleIds = decoded.roles;
        }

        next();
    } catch (error) {
        next(error);
    }
}

export function requireOrganization(req: Request, _res: Response, next: NextFunction) {
    const orgId = req.headers['x-organization-id'] || req.headers['x-tenant-id'];
    if (!orgId) {
        throw new AuthenticationError('Organization ID is required in request headers (x-organization-id)');
    }
    next();
}
