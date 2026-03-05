import { Router } from "express";
import asyncHandler from "express-async-handler";
import { PowerSystemController } from "@/entities/power-system/power-system.controller";
import { PowerSystemRepository } from "@/entities/power-system/power-system.repository";
import { PowerSystemService } from "@/entities/power-system/power-system.service";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();

// Composition Root
const repository = new PowerSystemRepository();
const service = new PowerSystemService(repository);
const controller = new PowerSystemController(service);

// POST /api/power-systems
router.post(
    "/",
    authenticateToken,
    asyncHandler((req, res) => controller.createPowerSystem(req, res)),
);

// GET /api/power-systems
router.get(
    "/",
    authenticateToken,
    asyncHandler((req, res) => controller.getPowerSystems(req, res)),
);

// GET /api/power-systems/graph/:universeId
router.get(
    "/graph/:universeId",
    authenticateToken,
    asyncHandler((req, res) => controller.getPowerSystemsGraph(req, res)),
);

// GET /api/power-systems/:id
router.get(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.getPowerSystemById(req, res)),
);

// PATCH /api/power-systems/:id
router.patch(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updatePowerSystem(req, res)),
);

// DELETE /api/power-systems/:id
router.delete(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deletePowerSystem(req, res)),
);

export default router;
