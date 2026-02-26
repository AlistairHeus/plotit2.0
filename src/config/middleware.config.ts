import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { createTokenRefreshMiddleware } from '../middleware/token-refresh.middleware';
import { configureCors } from '../utils/cors';
import { requestLogger } from '../utils/server-lifecycle';

export const configureMiddleware = (app: Express): void => {
  // Security headers
  app.use(helmet());

  // CORS configuration
  configureCors(app);

  // Parse cookies
  app.use(cookieParser());

  // Parse JSON and URL-encoded bodies
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // Request logging middleware
  app.use(requestLogger);

  // Token refresh middleware (should be applied before routes)
  app.use(createTokenRefreshMiddleware());
};
