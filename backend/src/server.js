"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const logger_1 = require("./config/logger");
async function startServer() {
    try {
        await (0, database_1.connectDB)();
        await (0, redis_1.connectRedis)();
        app_1.default.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`🚀 Server running on port ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error("Server startup failed", error);
        process.exit(1);
    }
}
startServer();
