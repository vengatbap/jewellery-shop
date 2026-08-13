import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate as drizzleMigrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

export async function migrate() {
    console.log('🚀 Running database migrations...');

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('❌ DATABASE_URL environment variable is not defined.');
        process.exit(1);
    }

    const isNeon = connectionString.includes('neon.tech') || connectionString.includes('sslmode=require');
    const pool = new pg.Pool({
        connectionString,
        ssl: isNeon || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });
    const db = drizzle(pool);

    try {
        await drizzleMigrate(db, {
            migrationsFolder: join(__dirname, '../drizzle'),
        });
        console.log('✅ Migrations completed successfully!');
        await pool.end();
    } catch (error) {
        console.error('❌ Migration failed:', error);
        await pool.end();
        process.exit(1);
    }
}

// Run if called directly
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
    migrate().catch(console.error);
}
