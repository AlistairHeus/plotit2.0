import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { RegionService } from "@/entities/region/region.service";
import {
    createRegionSchema,
    regionQuerySchema,
    updateRegionSchema,
} from "@/entities/region/region.validation";
import {
    validateBody,
    validateParams,
    validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class RegionController {
    private regionService: RegionService;

    constructor(regionService: RegionService) {
        this.regionService = regionService;
    }

    async createRegion(req: Request, res: Response): Promise<void> {
        const regionData = validateBody(req.body, createRegionSchema);

        // No direct explicit user authentication enforcement like universe since regions
        // are more likely global, but we pass data as validated.
        const region = await this.regionService.createRegion(regionData);

        log.info("Region created successfully", {
            regionId: region.id,
            operation: "create_region",
        });

        res.status(201).json({
            success: true,
            data: region,
            message: "Region created successfully",
        });
    }

    async getRegions(req: Request, res: Response): Promise<void> {
        const regionData = validateQuery(req.query, regionQuerySchema);

        const result = await this.regionService.getRegions(regionData);

        log.info("Regions retrieved successfully", {
            count: result.data.length,
            totalItems: result.pagination.totalItems,
            currentPage: result.pagination.currentPage,
            operation: "get_regions",
        });

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
            message: "Regions retrieved successfully",
        });
    }

    async getRegionById(req: Request, res: Response): Promise<void> {
        const regionId = validateParams(req.params.id, paramsSchema);

        const region = await this.regionService.getRegionById(regionId);

        if (!region) {
            throw new NotFoundError("Region", regionId);
        }

        res.status(200).json({
            success: true,
            data: region,
            message: "Region retrieved successfully",
        });
    }

    async updateRegion(req: Request, res: Response): Promise<void> {
        const regionId = validateParams(req.params.id, paramsSchema);
        const regionData = validateBody(req.body, updateRegionSchema);

        const region = await this.regionService.updateRegion(regionId, regionData);

        log.info("Region updated successfully", {
            regionId: region.id,
            operation: "update_region",
        });

        res.status(200).json({
            success: true,
            data: region,
            message: "Region updated successfully",
        });
    }

    async deleteRegion(req: Request, res: Response): Promise<void> {
        const validationResult = validateParams(req.params.id, paramsSchema);

        await this.regionService.deleteRegion(validationResult);

        log.info("Region deleted successfully", {
            operation: "delete_region",
        });

        res.status(200).json({
            success: true,
            message: "Region deleted successfully",
        });
    }
}
