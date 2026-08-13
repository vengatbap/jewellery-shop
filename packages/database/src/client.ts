import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

// Auto-load .env if process.env.DATABASE_URL is missing
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

const connectionString = process.env.DATABASE_URL;
const isNeon = connectionString?.includes('neon.tech') || connectionString?.includes('sslmode=require');

const pool = new pg.Pool({
    connectionString,
    ssl: isNeon || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool);

export type Database = typeof db;
