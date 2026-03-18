import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { IdeaBoardService } from "@/entities/idea-board/idea-board.service";
import {
  createIdeaBoardSchema,
  ideaBoardQuerySchema,
  updateIdeaBoardSchema,
} from "@/entities/idea-board/idea-board.validation";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class IdeaBoardController {
  private ideaBoardService: IdeaBoardService;

  constructor(ideaBoardService: IdeaBoardService) {
    this.ideaBoardService = ideaBoardService;
  }

  async createIdeaBoard(req: Request, res: Response): Promise<void> {
    const ideaBoardData = validateBody(req.body, createIdeaBoardSchema);

    const ideaBoard =
      await this.ideaBoardService.createIdeaBoard(ideaBoardData);

    log.info("IdeaBoard created successfully", {
      ideaBoardId: ideaBoard.id,
      operation: "create_idea-board",
    });

    res.status(201).json({
      success: true,
      data: ideaBoard,
      message: "IdeaBoard created successfully",
    });
  }

  async getIdeaBoards(req: Request, res: Response): Promise<void> {
    const ideaBoardData = validateQuery(req.query, ideaBoardQuerySchema);

    const result =
      await this.ideaBoardService.getIdeaBoards(ideaBoardData);

    log.info("IdeaBoards retrieved successfully", {
      count: result.data.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      operation: "get_idea-boards",
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "IdeaBoards retrieved successfully",
    });
  }

  async getIdeaBoardById(req: Request, res: Response): Promise<void> {
    const ideaBoardId = validateParams<string>(req.params.id, paramsSchema);

    const ideaBoard =
      await this.ideaBoardService.getIdeaBoardById(ideaBoardId);

    if (!ideaBoard) {
      throw new NotFoundError("IdeaBoard", ideaBoardId);
    }

    res.status(200).json({
      success: true,
      data: ideaBoard,
      message: "IdeaBoard retrieved successfully",
    });
  }

  async updateIdeaBoard(req: Request, res: Response): Promise<void> {
    const ideaBoardId = validateParams<string>(req.params.id, paramsSchema);
    const ideaBoardData = validateBody(req.body, updateIdeaBoardSchema);

    const ideaBoard = await this.ideaBoardService.updateIdeaBoard(
      ideaBoardId,
      ideaBoardData,
    );

    log.info("IdeaBoard updated successfully", {
      ideaBoardId: ideaBoard.id,
      operation: "update_idea-board",
    });

    res.status(200).json({
      success: true,
      data: ideaBoard,
      message: "IdeaBoard updated successfully",
    });
  }

  async deleteIdeaBoard(req: Request, res: Response): Promise<void> {
    const id = validateParams<string>(req.params.id, paramsSchema);
    await this.ideaBoardService.deleteIdeaBoard(id);
    log.info("IdeaBoard deleted successfully", {
      id,
      operation: "delete_idea-board",
    });
    res
      .status(200)
      .json({ success: true, message: "IdeaBoard deleted successfully" });
  }
}
