import { Router } from "express";
import asyncHandler from "express-async-handler";
import { FactionController } from "@/entities/faction/faction.controller";
import { FactionRepository } from "@/entities/faction/faction.repository";
import { FactionService } from "@/entities/faction/faction.service";
import { authenticateToken } from "@/middleware/auth.middleware";
import { upload } from "@/middleware/upload.middleware";
import { fileService } from "@/common/file/file.service";

const router = Router();
const repository = new FactionRepository();
const service = new FactionService(repository, fileService);
const controller = new FactionController(service);

// ── Relationships (MUST be declared before /:id to avoid conflict) ────────────

router.get("/relationships", authenticateToken,
  asyncHandler((req, res) => controller.getRelationships(req, res)),
);

router.post("/relationships", authenticateToken,
  asyncHandler((req, res) => controller.createRelationship(req, res)),
);

router.patch("/relationships/:id", authenticateToken,
  asyncHandler((req, res) => controller.updateRelationship(req, res)),
);

router.delete("/relationships/:id", authenticateToken,
  asyncHandler((req, res) => controller.deleteRelationship(req, res)),
);

// ── Factions ──────────────────────────────────────────────────────────────────

router.post("/", authenticateToken,
  upload.fields([{ name: "avatar", maxCount: 1 }, { name: "images", maxCount: 20 }]),
  asyncHandler((req, res) => controller.createFaction(req, res)),
);

router.get("/", authenticateToken,
  asyncHandler((req, res) => controller.getFactions(req, res)),
);

router.get("/:id", authenticateToken,
  asyncHandler((req, res) => controller.getFactionById(req, res)),
);

router.patch("/:id", authenticateToken,
  upload.fields([{ name: "avatar", maxCount: 1 }, { name: "images", maxCount: 20 }]),
  asyncHandler((req, res) => controller.updateFaction(req, res)),
);

router.delete("/:id", authenticateToken,
  asyncHandler((req, res) => controller.deleteFaction(req, res)),
);

export default router;
