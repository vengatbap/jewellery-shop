import { app } from './app';
import { logger } from '@auric-one/core';

const port = process.env.PORT || 3002;

const server = app.listen(port, () => {
    logger.info({ port }, 'Configuration Service started successfully');
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
    });
});
