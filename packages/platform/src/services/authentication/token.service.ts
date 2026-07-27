import jwt from 'jsonwebtoken';
import { config } from '@auric-one/config';

export interface JwtPayload {
    sub: string;                   // User ID
    org: string;                   // Organization ID
    branch?: string;               // Branch ID (optional)
    sid: string;                   // Session ID
    roles: string[];               // Assigned Roles
    permissions_version: number;   // Permissions snapshot version
}

export class TokenService {
    static signAccessToken(payload: JwtPayload): string {
        const secret = config.auth.jwtAccessSecret as string;
        const expiresIn = config.auth.jwtAccessExpiry as jwt.SignOptions['expiresIn'];
        return jwt.sign(payload, secret, { expiresIn });
    }

    static verifyAccessToken(token: string): JwtPayload {
        const secret = config.auth.jwtAccessSecret as string;
        return jwt.verify(token, secret) as JwtPayload;
    }

    static signRefreshToken(payload: { sub: string; sid: string }): string {
        const secret = config.auth.jwtRefreshSecret as string;
        const expiresIn = config.auth.jwtRefreshExpiry as jwt.SignOptions['expiresIn'];
        return jwt.sign(payload, secret, { expiresIn });
    }

    static verifyRefreshToken(token: string): { sub: string; sid: string } {
        const secret = config.auth.jwtRefreshSecret as string;
        return jwt.verify(token, secret) as { sub: string; sid: string };
    }
}
