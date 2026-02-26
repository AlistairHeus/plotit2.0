import os from 'node:os';
import pino from 'pino';
import type { LogMetadata } from '@/common/common.types';

const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL ?? 'info';

const logger = pino({
  level: logLevel,
  ...(isProduction
    ? {}
    : {
        transport: {
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            singleLine: false,
            translateTime: 'SYS:standard',
          },
          target: 'pino-pretty',
        },
      }),
  base: {
    hostname: isProduction ? undefined : os.hostname(),
    pid: process.pid,
  },
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const log = {
  /**
   * Create a child logger with additional context
   * @param context - Additional context to include in all logs
   */
  child: (context: LogMetadata) => {
    const childLogger = logger.child(context);
    return {
      debug: (message: string, meta?: LogMetadata) => {
        childLogger.debug(meta, message);
      },
      error: (message: string, meta?: LogMetadata) => {
        childLogger.error(meta, message);
      },
      info: (message: string, meta?: LogMetadata) => {
        childLogger.info(meta, message);
      },
      trace: (message: string, meta?: LogMetadata) => {
        childLogger.trace(meta, message);
      },
      warn: (message: string, meta?: LogMetadata) => {
        childLogger.warn(meta, message);
      },
    };
  },

  /**
   * Log debug messages with optional metadata
   * @param message - Debug message
   * @param meta - Additional metadata
   */
  debug: (message: string, meta?: LogMetadata) => {
    logger.debug(meta, message);
  },

  /**
   * Log error messages with optional metadata
   * @param message - Error message
   * @param meta - Additional metadata (error object, user context, etc.)
   */
  error: (message: string, meta?: LogMetadata) => {
    logger.error(meta, message);
  },

  /**
   * Log info messages with optional metadata
   * @param message - Info message
   * @param meta - Additional metadata
   */
  info: (message: string, meta?: LogMetadata) => {
    logger.info(meta, message);
  },

  /**
   * Log trace messages with optional metadata
   * @param message - Trace message
   * @param meta - Additional metadata
   */
  trace: (message: string, meta?: LogMetadata) => {
    logger.trace(meta, message);
  },

  /**
   * Log warning messages with optional metadata
   * @param message - Warning message
   * @param meta - Additional metadata
   */
  warn: (message: string, meta?: LogMetadata) => {
    logger.warn(meta, message);
  },
};

export { logger };

export default log;
