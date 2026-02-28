import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import type { UniverseService } from "@/entities/universe/universe.service";
import {
  createUniverseSchema,
  universeQuerySchema,
  updateUniverseSchema,
} from "@/entities/universe/universe.validation";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class UniverseController {
  private universeService: UniverseService;

  constructor(universeService: UniverseService) {
    this.universeService = universeService;
  }

  async createUniverse(req: Request, res: Response): Promise<void> {
    const universeData = validateBody(req.body, createUniverseSchema);

    // Safety check; ensuring token middleware ran
    if (!req.user?.id) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized execution" });
      return;
    }

    const payload = { ...universeData, userId: req.user.id };
    const universe = await this.universeService.createUniverse(payload);

    log.info("Universe created successfully", {
      universeId: universe.id,
      operation: "create_universe",
    });

    res.status(201).json({
      success: true,
      data: universe,
      message: "Universe created successfully",
    });
  }

  async getUniverses(req: Request, res: Response): Promise<void> {
    const universeData = validateQuery(req.query, universeQuerySchema);

    const result = await this.universeService.getUniverses(universeData);

    log.info("Universes retrieved successfully", {
      count: result.data.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      operation: "get_universes",
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Universes retrieved successfully",
    });
  }

  async getUniverseById(req: Request, res: Response): Promise<void> {
    const universeId = validateParams(req.params.id, paramsSchema);

    const universe = await this.universeService.getUniverseById(universeId);

    if (!universe) {
      res.status(404).json({
        success: false,
        message: "Universe not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: universe,
      message: "Universe retrieved successfully",
    });
  }

  async updateUniverse(req: Request, res: Response): Promise<void> {
    const universeId = validateParams(req.params.id, paramsSchema);
    const universeData = validateBody(req.body, updateUniverseSchema);

    const universe = await this.universeService.updateUniverse(
      universeId,
      universeData,
    );

    log.info("Universe updated successfully", {
      universeId: universe.id,
      operation: "update_universe",
    });

    res.status(200).json({
      success: true,
      data: universe,
      message: "Universe updated successfully",
    });
  }

  async deleteUniverse(req: Request, res: Response): Promise<void> {
    const validationResult = validateParams(req.params.id, paramsSchema);

    await this.universeService.deleteUniverse(validationResult);

    log.info("Universe deleted successfully", {
      operation: "delete_universe",
    });

    res.status(200).json({
      success: true,
      message: "Universe deleted successfully",
    });
  }
}
