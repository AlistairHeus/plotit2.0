import { Router } from "express";
import asyncHandler from "express-async-handler";
import { CharacterController } from "@/entities/character/character.controller";
import { CharacterRepository } from "@/entities/character/character.repository";
import { CharacterService } from "@/entities/character/character.service";
import { authenticateToken } from "@/middleware/auth.middleware";
import { upload } from "@/middleware/upload.middleware";
import { fileService } from "@/common/file/file.service";

const router = Router();

const repository = new CharacterRepository();
const service = new CharacterService(repository, fileService);
const controller = new CharacterController(service);

// --- Character CRUD ---
// POST   /api/characters
router.post(
    "/",
    authenticateToken,
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 20 }]),
    asyncHandler((req, res) => controller.createCharacter(req, res))
);

// GET    /api/characters
router.get("/", authenticateToken, asyncHandler((req, res) => controller.getCharacters(req, res)));

// GET    /api/characters/:id
router.get("/:id", authenticateToken, asyncHandler((req, res) => controller.getCharacterById(req, res)));

// PATCH    /api/characters/:id
router.patch(
    "/:id",
    authenticateToken,
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 20 }]),
    asyncHandler((req, res) => controller.updateCharacter(req, res))
);

// GET    /api/characters/:id/power-access
router.get("/:id/power-access", authenticateToken, asyncHandler((req, res) => controller.getPowerAccess(req, res)));

// PUT    /api/characters/:id/power-access
router.put("/:id/power-access", authenticateToken, asyncHandler((req, res) => controller.syncPowerAccess(req, res)));

export default router;
