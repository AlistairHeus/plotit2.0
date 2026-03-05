import { Router } from "express";
import asyncHandler from "express-async-handler";
import { ConstructController } from "@/entities/construct/construct.controller";
import { ConstructRepository } from "@/entities/construct/construct.repository";
import { ConstructService } from "@/entities/construct/construct.service";
import { authenticateToken } from "@/middleware/auth.middleware";
import { upload } from "@/middleware/upload.middleware";
import { fileService } from "@/common/file/file.service";

const router = Router();

// Ensure manual composition root definition
const repository = new ConstructRepository();
const service = new ConstructService(repository, fileService);
const controller = new ConstructController(service);

// POST /api/constructs
router.post(
    "/",
    authenticateToken,
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 20 }]),
    asyncHandler((req, res) => controller.createConstruct(req, res)),
);

// GET /api/constructs
router.get(
    "/",
    authenticateToken,
    asyncHandler((req, res) => controller.getConstructs(req, res)),
);

// GET /api/constructs/:id
router.get(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.getConstructById(req, res)),
);

// PATCH /api/constructs/:id
router.patch(
    "/:id",
    authenticateToken,
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 20 }]),
    asyncHandler((req, res) => controller.updateConstruct(req, res)),
);

// DELETE /api/constructs/:id
router.delete(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteConstruct(req, res)),
);

export default router;
