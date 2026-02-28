import { Router } from "express";
import asyncHandler from "express-async-handler";
import { UniverseController } from "@/entities/universe/universe.controller";
import { UniverseRepository } from "@/entities/universe/universe.repository";
import { UniverseService } from "@/entities/universe/universe.service";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();

const repository = new UniverseRepository();
const service = new UniverseService(repository);
const controller = new UniverseController(service);

// POST /api/universes
router.post(
  "/",
  authenticateToken,
  asyncHandler((req, res) => controller.createUniverse(req, res)),
);

// GET /api/universes
router.get(
  "/",
  authenticateToken,
  asyncHandler((req, res) => controller.getUniverses(req, res)),
);

// GET /api/universes/:id
router.get(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => controller.getUniverseById(req, res)),
);

// PUT /api/universes/:id
router.put(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => controller.updateUniverse(req, res)),
);

// DELETE /api/universes/:id
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => controller.deleteUniverse(req, res)),
);

export default router;
