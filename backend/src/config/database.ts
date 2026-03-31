import { Pool } from "pg";
import { env } from "./env";
import { logger } from "./logger";

export const pool = new Pool({
  connectionString: env.DATABASE_URL
});

export const connectDB = async () => {
  try {
    await pool.connect();
    logger.info("✅ PostgreSQL Connected");
  } catch (error) {
    logger.error("❌ Database connection failed");
    process.exit(1);
  }
};