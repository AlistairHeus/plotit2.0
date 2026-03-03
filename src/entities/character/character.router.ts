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

// DELETE /api/characters/:id
router.delete("/:id", authenticateToken, asyncHandler((req, res) => controller.deleteCharacter(req, res)));

export default router;
