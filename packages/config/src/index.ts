import { env } from './env';

export const config = {
    app: {
        env: env.NODE_ENV,
        port: env.API_PORT,
        host: env.API_HOST,
        prefix: env.API_PREFIX,
    },
    database: {
        url: env.DATABASE_URL,
    },
    auth: {
        jwtSecret: env.JWT_SECRET,
        jwtAccessSecret: env.JWT_ACCESS_SECRET || env.JWT_SECRET,
        jwtAccessExpiry: env.JWT_ACCESS_EXPIRY,
        jwtRefreshSecret: env.JWT_REFRESH_SECRET || env.JWT_SECRET,
        jwtRefreshExpiry: env.JWT_REFRESH_EXPIRY,
    },
    cors: {
        origin: env.CORS_ORIGIN,
    },
    logger: {
        level: env.LOG_LEVEL,
    },
    cache: {
        redisUrl: env.REDIS_URL,
    },
    storage: {
        type: env.FILE_STORAGE_TYPE,
        path: env.FILE_STORAGE_PATH,
    },
    featureFlags: {
        enableNotifications: true,
    }
} as const;

export type AppConfig = typeof config;
export { PERMISSIONS, SYSTEM_ROLES, ROLE_PERMISSIONS } from './permissions';
