import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import helmet from "helmet";

import { configureCors } from "../utils/cors";
import { requestLogger } from "../utils/server-lifecycle";

import fs from "fs";
import path from "path";

export const configureMiddleware = (app: Express): void => {
  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // CORS configuration
  configureCors(app);

  // Parse cookies
  app.use(cookieParser());

  // Parse JSON and URL-encoded bodies
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true, limit: "100mb" }));

  // Request logging middleware
  app.use(requestLogger);

  // Serve static files from uploads directory
  const uploadsPath = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  app.use("/uploads", express.static(uploadsPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (filePath.endsWith('.gif')) {
        res.setHeader('Content-Type', 'image/gif');
      } else if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
    }
  }));

};
