import { createClient } from "redis";
import { env } from "./env";
import { logger } from "./logger";

export const redisClient = createClient({
  url: env.REDIS_URL
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info("✅ Redis Connected");
  } catch (error) {
    logger.error("❌ Redis connection failed");
  }
};