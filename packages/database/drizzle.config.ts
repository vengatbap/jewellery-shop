import type { Config } from 'drizzle-kit';

export default {
    schema: './src/schema/**/*.ts',
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_h0o5XDEKgYPV@ep-hidden-cloud-ayd2x511-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    },
} satisfies Config;
