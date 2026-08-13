import { z } from 'zod';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Auto-load .env into process.env if DATABASE_URL is missing
if (!process.env.DATABASE_URL) {
    const candidatePaths = [
        resolve(process.cwd(), '.env'),
        resolve(process.cwd(), '../../.env'),
        resolve(process.cwd(), '../.env'),
    ];

    for (const envPath of candidatePaths) {
        if (existsSync(envPath)) {
            try {
                if (typeof (process as any).loadEnvFile === 'function') {
                    (process as any).loadEnvFile(envPath);
                } else {
                    const content = readFileSync(envPath, 'utf8');
                    for (const line of content.split('\n')) {
                        const trimmed = line.trim();
                        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                            const [key, ...vals] = trimmed.split('=');
                            const val = vals.join('=').trim().replace(/^["']|["']$/g, '');
                            if (key && val && !process.env[key.trim()]) {
                                process.env[key.trim()] = val;
                            }
                        }
                    }
                }
            } catch (_) {}
            if (process.env.DATABASE_URL) break;
        }
    }
}

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
    throw new Error(`Invalid environment variables: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
}

export const env = parsed.data;
