import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().url(),
    API_PORT: z.coerce.number().default(3000),
    API_HOST: z.string().default('localhost'),
    API_PREFIX: z.string().default('/api/v1'),
    JWT_SECRET: z.string().min(32),
    JWT_ACCESS_SECRET: z.string().min(32).optional(),
    JWT_ACCESS_EXPIRY: z.string().default('15m'),
    JWT_REFRESH_SECRET: z.string().min(32).optional(),
    JWT_REFRESH_EXPIRY: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('*'),
    FILE_STORAGE_TYPE: z.enum(['local', 's3']).default('local'),
    FILE_STORAGE_PATH: z.string().default('./uploads'),
    REDIS_URL: z.string().optional(),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten());
    process.exit(1);
}

export const env = parsed.data;
