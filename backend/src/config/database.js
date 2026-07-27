"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
const logger_1 = require("./logger");
exports.pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL
});
const connectDB = async () => {
    try {
        await exports.pool.connect();
        logger_1.logger.info("✅ PostgreSQL Connected");
    }
    catch (error) {
        logger_1.logger.error("❌ Database connection failed");
        process.exit(1);
    }
};
exports.connectDB = connectDB;
