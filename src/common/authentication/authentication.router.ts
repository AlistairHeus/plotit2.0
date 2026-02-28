import { Router } from "express";
import asyncHandler from "express-async-handler";
import { UserRepository } from "@/entities/user/user.repository";
import { authenticateToken } from "@/middleware/auth.middleware";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";

const router = Router();

const userRepository = new UserRepository();
const service = new AuthenticationService(userRepository);
const controller = new AuthenticationController(service);

// POST /api/auth/login
router.post(
  "/login",
  asyncHandler((req, res) => controller.login(req, res)),
);

// POST /api/auth/refresh
router.post(
  "/refresh",
  asyncHandler((req, res) => controller.refresh(req, res)),
);

// POST /api/auth/logout
router.post(
  "/logout",
  asyncHandler((req, res) => controller.logout(req, res)),
);

// GET /api/auth/verify
router.get(
  "/verify",
  authenticateToken(),
  asyncHandler((req, res) => controller.verify(req, res)),
);

export default router;
