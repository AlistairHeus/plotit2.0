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

// Grid Operations
router.post(
    "/:id/grid/initialize",
    asyncHandler(mapController.initializeGrid.bind(mapController)),
);

router.put(
    "/:id/grid",
    asyncHandler(mapController.updateGrid.bind(mapController)),
);

router.put(
    "/:id/cell",
    asyncHandler(mapController.updateCell.bind(mapController)),
);

// SVG Mapping Operations
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
