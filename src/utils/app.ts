import express from 'express';

import { configureErrorHandlers } from '../config/error-handler.config';
import { configureMiddleware } from '../config/middleware.config';
import { configureRoutes } from '../config/routes.config';

export const createApp = (): express.Application => {
  const app = express();

  // Configure all middleware
  configureMiddleware(app);

  // Configure routes and error handlers
  configureRoutes(app);
  configureErrorHandlers(app);

  return app;
};
