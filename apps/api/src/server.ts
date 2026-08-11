import { app } from './app.js';
import { config } from '@auric-one/config';
import { logger } from '@auric-one/core';

const port = config.app.port || 3000;
const host = config.app.host || 'localhost';

const server = app.listen(port, host, () => {
    logger.info(`🚀 Auric One API Gateway running at http://${host}:${port}${config.app.prefix}`);
});

// Graceful Shutdown Sequence
const shutdown = (signal: string) => {
    logger.warn(`Received ${signal}. Starting graceful shutdown sequence...`);

    // 1. Close HTTP Server (reject new requests)
    server.close(() => {
        logger.info('HTTP server closed successfully.');

        // 2. Close Database Pool (when database pool is initialized in Sprint 1B)
        logger.info('Database pool closed (placeholder).');

        // 3. Close Redis/Cache (placeholder)
        logger.info('Redis cache connection closed (placeholder).');

        // 4. Close Background workers (placeholder)
        logger.info('Background workers closed (placeholder).');

        logger.info('Graceful shutdown completed. Exiting process.');
        process.exit(0);
    });

    // Force shutdown after 10s timeout
    setTimeout(() => {
        logger.error('Force shutdown triggered due to timeout.');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
