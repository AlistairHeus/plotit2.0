import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { RaceService } from "@/entities/race/race.service";
import {
    createRaceSchema,
    raceQuerySchema,
    updateRaceSchema,
} from "@/entities/race/race.validation";
import {
    validateBody,
    validateParams,
    validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class RaceController {
    private raceService: RaceService;

    constructor(raceService: RaceService) {
        this.raceService = raceService;
    }

    async createRace(req: Request, res: Response): Promise<void> {
        const raceData = validateBody(req.body, createRaceSchema);

        // No direct explicit user authentication enforcement like universe since races
        // are more likely global, but we pass data as validated.
        const race = await this.raceService.createRace(raceData);

        log.info("Race created successfully", {
            raceId: race.id,
            operation: "create_race",
        });

        res.status(201).json({
            success: true,
            data: race,
            message: "Race created successfully",
        });
    }

    async getRaces(req: Request, res: Response): Promise<void> {
        const raceData = validateQuery(req.query, raceQuerySchema);

        const result = await this.raceService.getRaces(raceData);

        log.info("Races retrieved successfully", {
            count: result.data.length,
            totalItems: result.pagination.totalItems,
            currentPage: result.pagination.currentPage,
            operation: "get_races",
        });

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
            message: "Races retrieved successfully",
        });
    }

    async getRaceById(req: Request, res: Response): Promise<void> {
        const raceId = validateParams(req.params.id, paramsSchema);

        const race = await this.raceService.getRaceById(raceId);

        if (!race) {
            throw new NotFoundError("Race", raceId);
        }

        res.status(200).json({
            success: true,
            data: race,
            message: "Race retrieved successfully",
        });
    }

    async updateRace(req: Request, res: Response): Promise<void> {
        const raceId = validateParams(req.params.id, paramsSchema);
        const raceData = validateBody(req.body, updateRaceSchema);

        const race = await this.raceService.updateRace(raceId, raceData);

        log.info("Race updated successfully", {
            raceId: race.id,
            operation: "update_race",
        });

        res.status(200).json({
            success: true,
            data: race,
            message: "Race updated successfully",
        });
    }

    async deleteRace(req: Request, res: Response): Promise<void> {
        const validationResult = validateParams(req.params.id, paramsSchema);

        await this.raceService.deleteRace(validationResult);

        log.info("Race deleted successfully", {
            operation: "delete_race",
        });

        res.status(200).json({
            success: true,
            message: "Race deleted successfully",
        });
    }
}
