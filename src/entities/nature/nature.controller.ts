import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { NatureService } from "@/entities/nature/nature.service";
import {
  createNatureSchema,
  natureQuerySchema,
  updateNatureSchema,
} from "@/entities/nature/nature.validation";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class NatureController {
  private natureService: NatureService;

  constructor(natureService: NatureService) {
    this.natureService = natureService;
  }

  async createNature(req: Request, res: Response): Promise<void> {
    const natureData = validateBody(req.body, createNatureSchema);
    const files =
      req.files && !Array.isArray(req.files) ? req.files : undefined;

    // No direct explicit user authentication enforcement like universe since natures
    // are more likely global, but we pass data as validated.
    const nature = await this.natureService.createNature(
      natureData,
      files,
    );

    log.info("Nature created successfully", {
      natureId: nature.id,
      operation: "create_nature",
    });

    res.status(201).json({
      success: true,
      data: nature,
      message: "Nature created successfully",
    });
  }

  async getNatures(req: Request, res: Response): Promise<void> {
    const natureData = validateQuery(req.query, natureQuerySchema);

    const result = await this.natureService.getNatures(natureData);

    log.info("Natures retrieved successfully", {
      count: result.data.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      operation: "get_natures",
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Natures retrieved successfully",
    });
  }

  async getNatureById(req: Request, res: Response): Promise<void> {
    const natureId = validateParams(req.params.id, paramsSchema);

    const nature = await this.natureService.getNatureById(natureId);

    if (!nature) {
      throw new NotFoundError("Nature", natureId);
    }

    res.status(200).json({
      success: true,
      data: nature,
      message: "Nature retrieved successfully",
    });
  }

  async updateNature(req: Request, res: Response): Promise<void> {
    const natureId = validateParams(req.params.id, paramsSchema);
    const natureData = validateBody(req.body, updateNatureSchema);
    const files =
      req.files && !Array.isArray(req.files) ? req.files : undefined;

    const nature = await this.natureService.updateNature(
      natureId,
      natureData,
      files,
    );

    log.info("Nature updated successfully", {
      natureId: nature.id,
      operation: "update_nature",
    });

    res.status(200).json({
      success: true,
      data: nature,
      message: "Nature updated successfully",
    });
  }

  async deleteNature(req: Request, res: Response): Promise<void> {
    const validationResult = validateParams(req.params.id, paramsSchema);

    await this.natureService.deleteNature(validationResult);

    log.info("Nature deleted successfully", {
      operation: "delete_nature",
    });

    res.status(200).json({
      success: true,
      message: "Nature deleted successfully",
    });
  }
}
