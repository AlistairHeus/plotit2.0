import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import log from "@/utils/logger";
import type { MapService } from "@/entities/map/map.service";
import {
    createMapSchema,
    gridSetupSchema,
    mapQuerySchema,
    svgMappingSchema,
    updateMapSchema,
    cellUpdateWrapperSchema,
} from "@/entities/map/map.validation";
import {
    validateBody,
    validateParams,
    validateQuery,
} from "@/middleware/validation.middleware";

export class MapController {
    private mapService: MapService;

    constructor(mapService: MapService) {
        this.mapService = mapService;
    }

    async create(req: Request, res: Response): Promise<void> {
        const data = validateBody(req.body, createMapSchema);
        const file = req.file;

        if (!file) {
            res.status(400).json({ success: false, message: "Image file is required" });
            return;
        }

        const map = await this.mapService.createMap(data, file);

        log.info("Map created successfully", {
            mapId: map.id,
            operation: "create_map"
        });

        res.status(201).json({
            success: true,
            data: map,
            message: "Map created successfully"
        });
    }

    async getAll(req: Request, res: Response): Promise<void> {
        const queryParams = validateQuery(req.query, mapQuerySchema);

        const result = await this.mapService.getMapsWithRelations(queryParams);

        log.info("Maps retrieved successfully", {
            count: result.data.length,
            totalItems: result.pagination.totalItems,
            currentPage: result.pagination.currentPage,
            operation: "get_maps",
        });

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
            message: "Maps retrieved successfully",
        });
    }

    async getById(req: Request, res: Response): Promise<void> {
        const mapId = validateParams(req.params.id, paramsSchema);

        const map = await this.mapService.getMapByIdWithRelations(mapId);

        res.status(200).json({
            success: true,
            data: map,
            message: "Map retrieved successfully"
        });
    }

    async update(req: Request, res: Response): Promise<void> {
        const mapId = validateParams(req.params.id, paramsSchema);
        const data = validateBody(req.body, updateMapSchema);
        const file = req.file;

        const map = await this.mapService.updateMap(mapId, data, file);

        log.info("Map updated successfully", {
            mapId: map.id,
            operation: "update_map"
        });

        res.status(200).json({
            success: true,
            data: map,
            message: "Map updated successfully"
        });
    }

    async delete(req: Request, res: Response): Promise<void> {
        const mapId = validateParams(req.params.id, paramsSchema);

        const success = await this.mapService.deleteMap(mapId);

        log.info("Map deleted successfully", {
            mapId,
            operation: "delete_map"
        });

        res.status(200).json({
            success: true,
            data: success,
            message: "Map deleted successfully"
        });
    }

    // Grid operations

    async initializeGrid(req: Request, res: Response): Promise<void> {
        const mapId = validateParams(req.params.id, paramsSchema);
        const settings = validateBody(req.body, gridSetupSchema);

        const map = await this.mapService.updateGridSettings(mapId, settings);

        log.info("Grid settings initialized", {
            mapId,
            operation: "initialize_grid"
        });

        res.status(200).json({
            success: true,
            data: map,
            message: "Grid settings initialized successfully"
        });
    }

    async updateGrid(req: Request, res: Response): Promise<void> {
        const mapId = validateParams(req.params.id, paramsSchema);
        const settings = validateBody(req.body, gridSetupSchema);

        const map = await this.mapService.updateGridSettings(mapId, settings);

        log.info("Grid settings updated", {
            mapId,
            operation: "update_grid"
        });

        res.status(200).json({
            success: true,
            data: map,
            message: "Grid settings updated successfully"
        });
    }

    async updateCell(req: Request, res: Response): Promise<void> {
        const mapId = validateParams(req.params.id, paramsSchema);
        const payload = validateBody(req.body, cellUpdateWrapperSchema);

        const map = await this.mapService.updateCellData(mapId, payload.key, payload.data);

        log.info("Grid cell updated", {
            mapId,
            cellKey: payload.key,
            operation: "update_cell"
        });

        res.status(200).json({
            success: true,
            data: map,
            message: "Grid cell updated successfully"
        });
    }

    // SVG Mapping operations

    async addSvgMapping(req: Request, res: Response): Promise<void> {
        const mapId = validateParams(req.params.id, paramsSchema);
        const mappingData = validateBody({ ...req.body, mapId }, svgMappingSchema);

        const mapping = await this.mapService.createSvgMapping(mappingData);

        log.info("SVG mapping added", {
            mapId,
            mappingId: mapping.id,
            operation: "add_svg_mapping"
        });

        res.status(201).json({
            success: true,
            data: mapping,
            message: "SVG mapping added successfully"
        });
    }

    async getSvgMappings(req: Request, res: Response): Promise<void> {
        const mapId = validateParams(req.params.id, paramsSchema);

        const mappings = await this.mapService.getSvgMappings(mapId);

        res.status(200).json({
            success: true,
            data: mappings,
            message: "SVG mappings retrieved successfully"
        });
    }

    async removeSvgMapping(req: Request, res: Response): Promise<void> {
        // Assuming paramsSchema is the correct validation for a generic ID in the URL params
        const mappingId = validateParams(req.params.mappingId, paramsSchema);

        const success = await this.mapService.removeSvgMapping(mappingId);

        log.info("SVG mapping removed", {
            mappingId,
            operation: "remove_svg_mapping"
        });

        res.status(200).json({
            success: true,
            data: success,
            message: "SVG mapping removed successfully"
        });
    }
}
