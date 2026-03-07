import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { ConstructService } from "@/entities/construct/construct.service";
import {
  createConstructSchema,
  constructQuerySchema,
  updateConstructSchema,
} from "@/entities/construct/construct.validation";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class ConstructController {
  private constructService: ConstructService;

  constructor(constructService: ConstructService) {
    this.constructService = constructService;
  }

  async createConstruct(req: Request, res: Response): Promise<void> {
    const constructData = validateBody(req.body, createConstructSchema);
    const files =
      req.files && !Array.isArray(req.files) ? req.files : undefined;

    // No direct explicit user authentication enforcement like universe since constructs
    // are more likely global, but we pass data as validated.
    const construct = await this.constructService.createConstruct(
      constructData,
      files,
    );

    log.info("Construct created successfully", {
      constructId: construct.id,
      operation: "create_construct",
    });

    res.status(201).json({
      success: true,
      data: construct,
      message: "Construct created successfully",
    });
  }

  async getConstructs(req: Request, res: Response): Promise<void> {
    const constructData = validateQuery(req.query, constructQuerySchema);

    const result = await this.constructService.getConstructs(constructData);

    log.info("Constructs retrieved successfully", {
      count: result.data.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      operation: "get_constructs",
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Constructs retrieved successfully",
    });
  }

  async getConstructById(req: Request, res: Response): Promise<void> {
    const constructId = validateParams(req.params.id, paramsSchema);

    const construct = await this.constructService.getConstructById(constructId);

    if (!construct) {
      throw new NotFoundError("Construct", constructId);
    }

    res.status(200).json({
      success: true,
      data: construct,
      message: "Construct retrieved successfully",
    });
  }

  async updateConstruct(req: Request, res: Response): Promise<void> {
    const constructId = validateParams(req.params.id, paramsSchema);
    const constructData = validateBody(req.body, updateConstructSchema);
    const files =
      req.files && !Array.isArray(req.files) ? req.files : undefined;

    const construct = await this.constructService.updateConstruct(
      constructId,
      constructData,
      files,
    );

    log.info("Construct updated successfully", {
      constructId: construct.id,
      operation: "update_construct",
    });

    res.status(200).json({
      success: true,
      data: construct,
      message: "Construct updated successfully",
    });
  }

  async deleteConstruct(req: Request, res: Response): Promise<void> {
    const validationResult = validateParams(req.params.id, paramsSchema);

    await this.constructService.deleteConstruct(validationResult);

    log.info("Construct deleted successfully", {
      operation: "delete_construct",
    });

    res.status(200).json({
      success: true,
      message: "Construct deleted successfully",
    });
  }
}
