import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { FactionService } from "@/entities/faction/faction.service";
import {
  createFactionSchema,
  factionQuerySchema,
  updateFactionSchema,
} from "@/entities/faction/faction.validation";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class FactionController {
  private factionService: FactionService;

  constructor(factionService: FactionService) {
    this.factionService = factionService;
  }

  async createFaction(req: Request, res: Response): Promise<void> {
    const factionData = validateBody(req.body, createFactionSchema);
    const files =
      req.files && !Array.isArray(req.files) ? req.files : undefined;

    const faction = await this.factionService.createFaction(factionData, files);

    log.info("Faction created successfully", {
      factionId: faction.id,
      operation: "create_faction",
    });

    res.status(201).json({
      success: true,
      data: faction,
      message: "Faction created successfully",
    });
  }

  async getFactions(req: Request, res: Response): Promise<void> {
    const factionData = validateQuery(req.query, factionQuerySchema);

    const result = await this.factionService.getFactions(factionData);

    log.info("Factions retrieved successfully", {
      count: result.data.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      operation: "get_factions",
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Factions retrieved successfully",
    });
  }

  async getFactionById(req: Request, res: Response): Promise<void> {
    const factionId = validateParams(req.params.id, paramsSchema);

    const faction = await this.factionService.getFactionById(factionId);

    if (!faction) {
      throw new NotFoundError("Faction", factionId);
    }

    res.status(200).json({
      success: true,
      data: faction,
      message: "Faction retrieved successfully",
    });
  }

  async updateFaction(req: Request, res: Response): Promise<void> {
    const factionId = validateParams(req.params.id, paramsSchema);
    const factionData = validateBody(req.body, updateFactionSchema);
    const files =
      req.files && !Array.isArray(req.files) ? req.files : undefined;

    const faction = await this.factionService.updateFaction(
      factionId,
      factionData,
      files,
    );

    log.info("Faction updated successfully", {
      factionId: faction.id,
      operation: "update_faction",
    });

    res.status(200).json({
      success: true,
      data: faction,
      message: "Faction updated successfully",
    });
  }

  async deleteFaction(req: Request, res: Response): Promise<void> {
    const validationResult = validateParams(req.params.id, paramsSchema);

    await this.factionService.deleteFaction(validationResult);

    log.info("Faction deleted successfully", {
      operation: "delete_faction",
    });

    res.status(200).json({
      success: true,
      message: "Faction deleted successfully",
    });
  }
}
