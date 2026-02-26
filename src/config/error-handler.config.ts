import type { Express } from 'express';

import {
  globalErrorHandler,
  notFoundHandler,
} from '@/middleware/error-handler.middleware';

/**
 * Configure error handlers for the Express application
 * This must be called after all routes are configured
 */
export const configureErrorHandlers = (app: Express): void => {
  // 404 handler for unmatched routes (must come before global error handler)
  app.use('*', notFoundHandler);

  // Global error handler (must be last middleware)
  app.use(globalErrorHandler);
};
