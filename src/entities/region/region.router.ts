import { Router } from "express";
import asyncHandler from "express-async-handler";
import { RegionController } from "@/entities/region/region.controller";
import { RegionRepository } from "@/entities/region/region.repository";
import { RegionService } from "@/entities/region/region.service";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();

// Ensure manual composition root definition
const repository = new RegionRepository();
const service = new RegionService(repository);
const controller = new RegionController(service);

// POST /api/regions
router.post(
    "/",
    authenticateToken,
    asyncHandler((req, res) => controller.createRegion(req, res)),
);

// GET /api/regions
router.get(
    "/",
    authenticateToken,
    asyncHandler((req, res) => controller.getRegions(req, res)),
);

// GET /api/regions/:id
router.get(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.getRegionById(req, res)),
);

// PATCH /api/regions/:id
router.patch(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updateRegion(req, res)),
);

// DELETE /api/regions/:id
router.delete(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteRegion(req, res)),
);

export default router;
