import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate as drizzleMigrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function migrate() {
    console.log('🚀 Running database migrations...');
    
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('❌ DATABASE_URL environment variable is not defined.');
        process.exit(1);
    }

    const pool = new pg.Pool({ connectionString });
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
