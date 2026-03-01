import { Router } from "express";
import asyncHandler from "express-async-handler";
import { RaceController } from "@/entities/race/race.controller";
import { RaceRepository } from "@/entities/race/race.repository";
import { RaceService } from "@/entities/race/race.service";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();

const repository = new RaceRepository();
const service = new RaceService(repository);
const controller = new RaceController(service);

// --- Race CRUD ---
// POST   /api/races
router.post("/", authenticateToken, asyncHandler((req, res) => controller.createRace(req, res)));

// GET    /api/races
router.get("/", authenticateToken, asyncHandler((req, res) => controller.getRaces(req, res)));

// GET    /api/races/:id
router.get("/:id", authenticateToken, asyncHandler((req, res) => controller.getRaceById(req, res)));

// PATCH    /api/races/:id
router.patch("/:id", authenticateToken, asyncHandler((req, res) => controller.updateRace(req, res)));

// DELETE /api/races/:id
router.delete("/:id", authenticateToken, asyncHandler((req, res) => controller.deleteRace(req, res)));

// --- Ethnic Groups (nested under race) ---
// POST   /api/races/:id/ethnic-groups
router.post("/:id/ethnic-groups", authenticateToken, asyncHandler((req, res) => controller.createEthnicGroup(req, res)));

// GET    /api/races/:id/ethnic-groups
router.get("/:id/ethnic-groups", authenticateToken, asyncHandler((req, res) => controller.getEthnicGroupsByRace(req, res)));

// GET    /api/races/:id/ethnic-groups/:groupId
router.get("/:id/ethnic-groups/:groupId", authenticateToken, asyncHandler((req, res) => controller.getEthnicGroupById(req, res)));

// PATCH    /api/races/:id/ethnic-groups/:groupId
router.patch("/:id/ethnic-groups/:groupId", authenticateToken, asyncHandler((req, res) => controller.updateEthnicGroup(req, res)));

// DELETE /api/races/:id/ethnic-groups/:groupId
router.delete("/:id/ethnic-groups/:groupId", authenticateToken, asyncHandler((req, res) => controller.deleteEthnicGroup(req, res)));

export default router;
