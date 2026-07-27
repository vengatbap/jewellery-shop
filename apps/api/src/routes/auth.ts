import { Router, Request, Response, NextFunction } from 'express';
import { AuthService, authenticate } from '@auric-one/platform';
import { ApiResponse, getExecutionContext } from '@auric-one/core';

export const authRouter: Router = Router();

// POST /api/v1/auth/login
authRouter.post('/auth/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, deviceName, deviceId } = req.body;
        
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const result = await AuthService.login(
            email,
            password,
            ipAddress,
            userAgent,
            deviceName,
            deviceId
        );

        res.cookie('refresh_token', result.refreshToken.split(':')[1], {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json(
            ApiResponse.success({
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                sessionId: result.sessionId,
            }, 'Login successful')
        );
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/auth/refresh
authRouter.post('/auth/refresh', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            res.status(400).json(ApiResponse.error('Refresh token is required', 'VALIDATION_ERROR', 400));
            return;
        }

        const parts = refreshToken.split(':');
        const tokenString = parts[0];
        const jwtRefreshToken = parts[1];

        if (!tokenString || !jwtRefreshToken) {
            res.status(400).json(ApiResponse.error('Invalid refresh token format', 'VALIDATION_ERROR', 400));
            return;
        }

        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const result = await AuthService.refresh(
            tokenString,
            jwtRefreshToken,
            ipAddress,
            userAgent
        );

        res.cookie('refresh_token', result.refreshToken.split(':')[1], {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json(
            ApiResponse.success({
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                sessionId: result.sessionId,
            }, 'Token refreshed')
        );
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/auth/logout
authRouter.post('/auth/logout', authenticate, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const context = getExecutionContext();
        const sessionId = context?.sessionId;

        if (sessionId) {
            await AuthService.logout(sessionId);
        }

        res.clearCookie('refresh_token');
        res.status(200).json(ApiResponse.success(null, 'Logout successful'));
    } catch (error) {
        next(error);
    }
});

// GET /api/v1/auth/me
authRouter.get('/auth/me', authenticate, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const context = getExecutionContext();
        res.status(200).json(
            ApiResponse.success({
                userId: context?.userId,
                organizationId: context?.organizationId,
                branchId: context?.branchId,
                roles: context?.roleIds,
            }, 'Profile fetched')
        );
    } catch (error) {
        next(error);
    }
});
