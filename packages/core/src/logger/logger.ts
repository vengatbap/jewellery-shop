import pino from 'pino';
import { getExecutionContext } from '../context/execution-context';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', 'body.password', 'body.token'],
        censor: '***'
    },
    mixin() {
        const context = getExecutionContext();
        if (!context) return {};
        return {
            requestId: context.requestId,
            correlationId: context.correlationId,
            traceId: context.traceId,
            organizationId: context.organizationId,
            branchId: context.branchId,
            userId: context.userId,
            service: context.service,
            environment: context.environment,
            hostname: context.hostname
        };
    },
    transport: !isProduction
        ? {
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname'
              }
          }
        : undefined
});
