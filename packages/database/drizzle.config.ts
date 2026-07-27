import type { Config } from 'drizzle-kit';

export default {
    schema: './src/schema/index.ts',
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/jewellery_erp',
    },
} satisfies Config;
