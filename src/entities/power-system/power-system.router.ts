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

// --- Roots of Power ---
router.post(
    "/roots",
    authenticateToken,
    asyncHandler((req, res) => controller.createRoot(req, res)),
);
router.patch(
    "/roots/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updateRoot(req, res)),
);
router.delete(
    "/roots/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteRoot(req, res)),
);

// --- Power Systems ---
router.post(
    "/",
    authenticateToken,
    asyncHandler((req, res) => controller.createPowerSystem(req, res)),
);
router.get(
    "/",
    authenticateToken,
    asyncHandler((req, res) => controller.getPowerSystems(req, res)),
);
router.get(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.getPowerSystemById(req, res)),
);
router.patch(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updatePowerSystem(req, res)),
);
router.delete(
    "/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deletePowerSystem(req, res)),
);

// --- Sub Systems ---
router.post(
    "/sub-systems",
    authenticateToken,
    asyncHandler((req, res) => controller.createSubSystem(req, res)),
);
router.patch(
    "/sub-systems/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updateSubSystem(req, res)),
);
router.delete(
    "/sub-systems/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteSubSystem(req, res)),
);

// --- Categories ---
router.post(
    "/categories",
    authenticateToken,
    asyncHandler((req, res) => controller.createCategory(req, res)),
);
router.patch(
    "/categories/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updateCategory(req, res)),
);
router.delete(
    "/categories/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteCategory(req, res)),
);

// --- Abilities ---
router.post(
    "/abilities",
    authenticateToken,
    asyncHandler((req, res) => controller.createAbility(req, res)),
);
router.patch(
    "/abilities/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updateAbility(req, res)),
);
router.delete(
    "/abilities/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteAbility(req, res)),
);

export default router;
