import { Router } from "express";
import asyncHandler from "express-async-handler";
import { RaceController } from "@/entities/race/race.controller";
import { RaceRepository } from "@/entities/race/race.repository";
import { RaceService } from "@/entities/race/race.service";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();

// Ensure manual composition root definition
const repository = new RaceRepository();
const service = new RaceService(repository);
const controller = new RaceController(service);

// POST /api/races
router.post(
    "/",
    authenticateToken,
    asyncHandler((req, res) => controller.createRace(req, res)),
);

// GET /api/races
router.get(
    "/",
    authenticateToken,
    asyncHandler((req, res) => controller.getRaces(req, res)),
);

// GET /api/races/:id
router.get(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.getRaceById(req, res)),
);

// PUT /api/races/:id
router.put(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updateRace(req, res)),
);

// DELETE /api/races/:id
router.delete(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteRace(req, res)),
);

export default router;
