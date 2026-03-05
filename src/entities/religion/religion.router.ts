import { Router } from "express";
import asyncHandler from "express-async-handler";
import { ReligionController } from "@/entities/religion/religion.controller";
import { ReligionRepository } from "@/entities/religion/religion.repository";
import { ReligionService } from "@/entities/religion/religion.service";
import { authenticateToken } from "@/middleware/auth.middleware";
import { upload } from "@/middleware/upload.middleware";
import { fileService } from "@/common/file/file.service";

const router = Router();

// Ensure manual composition root definition
const repository = new ReligionRepository();
const service = new ReligionService(repository, fileService);
const controller = new ReligionController(service);

// POST /api/religions
router.post(
    "/",
    authenticateToken,
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 20 }]),
    asyncHandler((req, res) => controller.createReligion(req, res)),
);

// GET /api/religions
router.get(
    "/",
    authenticateToken,
    asyncHandler((req, res) => controller.getReligions(req, res)),
);

// GET /api/religions/:id
router.get(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.getReligionById(req, res)),
);

// PATCH /api/religions/:id
router.patch(
    "/:id",
    authenticateToken,
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 20 }]),
    asyncHandler((req, res) => controller.updateReligion(req, res)),
);

// DELETE /api/religions/:id
router.delete(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteReligion(req, res)),
);

export default router;
