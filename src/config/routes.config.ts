import type { Express } from "express";
import authenticationRouter from "@/common/authentication/authentication.router";
import regionRouter from "@/entities/region/region.router";
import universeRouter from "@/entities/universe/universe.router";
import userRouter from "@/entities/user/user.router";
import { mapRouter } from "@/entities/map/map.router";
import raceRouter from "@/entities/race/race.router";

export const configureRoutes = (app: Express): void => {
  app.get("/health", (_req, res) => {
    res.json({
      environment: process.env.NODE_ENV ?? "development",
      status: "OK",
      timestamp: new Date().toISOString(),
    });
  });

  // Authentication routes
  app.use("/api/auth", authenticationRouter);

  // User routes
  app.use("/api/users", userRouter);

  // Universe routes
  app.use("/api/universes", universeRouter);

  // Region routes
  app.use("/api/regions", regionRouter);

  // Map routes
  app.use("/api/maps", mapRouter);

  // Race routes
  app.use("/api/races", raceRouter);
};
