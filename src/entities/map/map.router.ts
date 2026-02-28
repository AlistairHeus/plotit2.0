import { Router } from "express";
import asyncHandler from "express-async-handler";
import { fileService } from "@/common/file/file.service";
import { upload } from "@/middleware/upload.middleware";
import { MapController } from "@/entities/map/map.controller";
import { MapRepository } from "@/entities/map/map.repository";
import { MapService } from "@/entities/map/map.service";

const router = Router();

// Composition Root
const mapRepository = new MapRepository();
const mapService = new MapService(mapRepository, fileService);
const mapController = new MapController(mapService);

// Standard CRUD
router.post(
    "/",
    upload.single("image"),
    asyncHandler(mapController.create.bind(mapController)),
);

router.get("/", asyncHandler(mapController.getAll.bind(mapController)));

router.get("/:id", asyncHandler(mapController.getById.bind(mapController)));

router.put(
    "/:id",
    upload.single("image"),
    asyncHandler(mapController.update.bind(mapController)),
);

router.delete("/:id", asyncHandler(mapController.delete.bind(mapController)));

// SVG Mapping Operations
// POST   /:id/svg          — upsert a mapping (svgElementId → regionId)
// GET    /:id/svg          — get all mappings for a map
// DELETE /:id/svg/:mappingId — remove a mapping by DB id
router.post(
    "/:id/svg",
    asyncHandler(mapController.addSvgMapping.bind(mapController)),
);

router.get(
    "/:id/svg",
    asyncHandler(mapController.getSvgMappings.bind(mapController)),
);

router.delete(
    "/:id/svg/:mappingId",
    asyncHandler(mapController.removeSvgMapping.bind(mapController)),
);

export { router as mapRouter };
