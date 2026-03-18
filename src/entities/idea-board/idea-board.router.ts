import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IdeaBoardController } from "@/entities/idea-board/idea-board.controller";
import { IdeaBoardService } from "@/entities/idea-board/idea-board.service";
import { IdeaBoardRepository } from "@/entities/idea-board/idea-board.repository";
import { IDEA_BOARD_PATH } from "@/entities/idea-board/idea-board.constants";
import { authenticateToken } from "@/middleware/auth.middleware";

const ideaBoardRouter = Router();
const ideaBoardRepository = new IdeaBoardRepository();
const ideaBoardService = new IdeaBoardService(ideaBoardRepository);
const ideaBoardController = new IdeaBoardController(ideaBoardService);

ideaBoardRouter.use(authenticateToken);

ideaBoardRouter.post(
  "/",
  asyncHandler((req, res) => ideaBoardController.createIdeaBoard(req, res)),
);

ideaBoardRouter.get(
  "/",
  asyncHandler((req, res) => ideaBoardController.getIdeaBoards(req, res)),
);

ideaBoardRouter.get(
  "/:id",
  asyncHandler((req, res) => ideaBoardController.getIdeaBoardById(req, res)),
);

ideaBoardRouter.patch(
  "/:id",
  asyncHandler((req, res) => ideaBoardController.updateIdeaBoard(req, res)),
);

ideaBoardRouter.delete(
  "/:id",
  asyncHandler((req, res) => ideaBoardController.deleteIdeaBoard(req, res)),
);

export { ideaBoardRouter, IDEA_BOARD_PATH };
