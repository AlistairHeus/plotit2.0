import { Router } from "express";
import asyncHandler from "express-async-handler";
import { NatureController } from "@/entities/nature/nature.controller";
import { NatureRepository } from "@/entities/nature/nature.repository";
import { NatureService } from "@/entities/nature/nature.service";
import { authenticateToken } from "@/middleware/auth.middleware";
import { upload } from "@/middleware/upload.middleware";
import { fileService } from "@/common/file/file.service";

const router = Router();

// Ensure manual composition root definition
const repository = new NatureRepository();
const service = new NatureService(repository, fileService);
const controller = new NatureController(service);

// POST /api/natures
router.post(
  "/",
  authenticateToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  asyncHandler((req, res) => controller.createNature(req, res)),
);

// GET /api/natures
router.get(
  "/",
  authenticateToken,
  asyncHandler((req, res) => controller.getNatures(req, res)),
);

// GET /api/natures/:id
router.get(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => controller.getNatureById(req, res)),
);

// PATCH /api/natures/:id
router.patch(
  "/:id",
  authenticateToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  asyncHandler((req, res) => controller.updateNature(req, res)),
);

// DELETE /api/natures/:id
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => controller.deleteNature(req, res)),
);

export default router;
