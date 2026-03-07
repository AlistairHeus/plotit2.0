import { Router } from "express";
import asyncHandler from "express-async-handler";
import { FactionController } from "@/entities/faction/faction.controller";
import { FactionRepository } from "@/entities/faction/faction.repository";
import { FactionService } from "@/entities/faction/faction.service";
import { authenticateToken } from "@/middleware/auth.middleware";
import { upload } from "@/middleware/upload.middleware";
import { fileService } from "@/common/file/file.service";

const router = Router();

// Ensure manual composition root definition
const repository = new FactionRepository();
const service = new FactionService(repository, fileService);
const controller = new FactionController(service);

// POST /api/factions
router.post(
  "/",
  authenticateToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  asyncHandler((req, res) => controller.createFaction(req, res)),
);

// GET /api/factions
router.get(
  "/",
  authenticateToken,
  asyncHandler((req, res) => controller.getFactions(req, res)),
);

// GET /api/factions/:id
router.get(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => controller.getFactionById(req, res)),
);

// PATCH /api/factions/:id
router.patch(
  "/:id",
  authenticateToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  asyncHandler((req, res) => controller.updateFaction(req, res)),
);

// DELETE /api/factions/:id
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => controller.deleteFaction(req, res)),
);

export default router;
