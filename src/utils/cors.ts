import cors, { type CorsOptions } from "cors";
import type { Express } from "express";

export const corsConfig: CorsOptions = {
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  optionsSuccessStatus: 200,
  origin: [
    "http://localhost:5173",
    "https://localhost",
    "https://localhost:3000",
    "https://localhost:5173",
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:8081",
    "http://localhost:8082",
    "http://192.168.1.101:5173",
    "*",
  ],
};

export const configureCors = (app: Express): void => {
  app.use(cors(corsConfig));
};
