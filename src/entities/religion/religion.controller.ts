import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { ReligionService } from "@/entities/religion/religion.service";
import {
    createReligionSchema,
    religionQuerySchema,
    updateReligionSchema,
} from "@/entities/religion/religion.validation";
import {
    validateBody,
    validateParams,
    validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class ReligionController {
    private religionService: ReligionService;

    constructor(religionService: ReligionService) {
        this.religionService = religionService;
    }

    async createReligion(req: Request, res: Response): Promise<void> {
        const religionData = validateBody(req.body, createReligionSchema);
        const files = req.files && !Array.isArray(req.files) ? req.files : undefined;

        // No direct explicit user authentication enforcement like universe since religions
        // are more likely global, but we pass data as validated.
        const religion = await this.religionService.createReligion(religionData, files);

        log.info("Religion created successfully", {
            religionId: religion.id,
            operation: "create_religion",
        });

        res.status(201).json({
            success: true,
            data: religion,
            message: "Religion created successfully",
        });
    }

    async getReligions(req: Request, res: Response): Promise<void> {
        const religionData = validateQuery(req.query, religionQuerySchema);

        const result = await this.religionService.getReligions(religionData);

        log.info("Religions retrieved successfully", {
            count: result.data.length,
            totalItems: result.pagination.totalItems,
            currentPage: result.pagination.currentPage,
            operation: "get_religions",
        });

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
            message: "Religions retrieved successfully",
        });
    }

    async getReligionById(req: Request, res: Response): Promise<void> {
        const religionId = validateParams(req.params.id, paramsSchema);

        const religion = await this.religionService.getReligionById(religionId);

        if (!religion) {
            throw new NotFoundError("Religion", religionId);
        }

        res.status(200).json({
            success: true,
            data: religion,
            message: "Religion retrieved successfully",
        });
    }

    async updateReligion(req: Request, res: Response): Promise<void> {
        const religionId = validateParams(req.params.id, paramsSchema);
        const religionData = validateBody(req.body, updateReligionSchema);
        const files = req.files && !Array.isArray(req.files) ? req.files : undefined;

        const religion = await this.religionService.updateReligion(religionId, religionData, files);

        log.info("Religion updated successfully", {
            religionId: religion.id,
            operation: "update_religion",
        });

        res.status(200).json({
            success: true,
            data: religion,
            message: "Religion updated successfully",
        });
    }

    async deleteReligion(req: Request, res: Response): Promise<void> {
        const validationResult = validateParams(req.params.id, paramsSchema);

        await this.religionService.deleteReligion(validationResult);

        log.info("Religion deleted successfully", {
            operation: "delete_religion",
        });

        res.status(200).json({
            success: true,
            message: "Religion deleted successfully",
        });
    }
}
