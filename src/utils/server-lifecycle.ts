import type { Server } from 'node:http';
import type {
  Application,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
import { log } from '@/utils/logger';

export interface ServerConfig {
  port: number | string;
  shutdownTimeout?: number;
  environment?: string;
}

export const serverConfig = {
  port: process.env.PORT ?? 3000,
  shutdownTimeout: Number(process.env.SERVER_SHUTDOWN_TIMEOUT) || 10_000,
  environment: process.env.NODE_ENV ?? 'development',
};

export const startServer = (app: Application, config: ServerConfig): Server => {
  const port =
    typeof config.port === 'string'
      ? Number.parseInt(config.port, 10)
      : config.port;
  const server = app.listen(port, '0.0.0.0', () => {
    log.info('Server started successfully', {
      environment: config.environment ?? 'development',
      port,
      timestamp: new Date().toISOString(),
    });
  });

  return server;
};

export const setupGracefulShutdown = (
  server: Server,
  timeout = 10_000
): void => {
  const gracefulShutdown = (signal: string) => {
    log.info(`${signal} received, shutting down gracefully`);

    server.close(() => {
      log.info('HTTP server closed');
      process.exit(0);
    });

    setTimeout(() => {
      log.error(
        'Could not close connections in time, forcefully shutting down'
      );
      process.exit(1);
    }, timeout);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

export const requestLogger = (
  req: ExpressRequest,
  _: ExpressResponse,
  next: NextFunction
): void => {
  log.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
  });
  next();
};
