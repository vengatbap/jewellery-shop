"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
const logger_1 = require("./logger");
exports.redisClient = (0, redis_1.createClient)({
    url: env_1.env.REDIS_URL
});
const connectRedis = async () => {
    try {
        await exports.redisClient.connect();
        logger_1.logger.info("✅ Redis Connected");
    }
    catch (error) {
        logger_1.logger.error("❌ Redis connection failed");
    }
};
exports.connectRedis = connectRedis;
