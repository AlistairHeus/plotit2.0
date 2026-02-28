import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { RaceService } from "@/entities/race/race.service";
import {
    createEthnicGroupSchema,
    createRaceSchema,
    raceQuerySchema,
    updateEthnicGroupSchema,
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

    // --- Race ---

    async createRace(req: Request, res: Response): Promise<void> {
        const raceData = validateBody(req.body, createRaceSchema);
        const race = await this.raceService.createRace(raceData);

        log.info("Race created successfully", { raceId: race.id, operation: "create_race" });

        res.status(201).json({ success: true, data: race, message: "Race created successfully" });
    }

    async getRaces(req: Request, res: Response): Promise<void> {
        const queryParams = validateQuery(req.query, raceQuerySchema);
        const result = await this.raceService.getRaces(queryParams);

        log.info("Races retrieved successfully", {
            count: result.data.length,
            totalItems: result.pagination.totalItems,
            currentPage: result.pagination.currentPage,
            operation: "get_races",
        });

        res.status(200).json({ success: true, data: result.data, pagination: result.pagination, message: "Races retrieved successfully" });
    }

    async getRaceById(req: Request, res: Response): Promise<void> {
        const raceId = validateParams(req.params.id, paramsSchema);
        const race = await this.raceService.getRaceById(raceId);

        if (!race) throw new NotFoundError("Race", raceId);

        res.status(200).json({ success: true, data: race, message: "Race retrieved successfully" });
    }

    async updateRace(req: Request, res: Response): Promise<void> {
        const raceId = validateParams(req.params.id, paramsSchema);
        const raceData = validateBody(req.body, updateRaceSchema);
        const race = await this.raceService.updateRace(raceId, raceData);

        log.info("Race updated successfully", { raceId: race.id, operation: "update_race" });

        res.status(200).json({ success: true, data: race, message: "Race updated successfully" });
    }

    async deleteRace(req: Request, res: Response): Promise<void> {
        const raceId = validateParams(req.params.id, paramsSchema);
        await this.raceService.deleteRace(raceId);

        log.info("Race deleted successfully", { raceId, operation: "delete_race" });

        res.status(200).json({ success: true, message: "Race deleted successfully" });
    }

    // --- Ethnic Groups ---

    async createEthnicGroup(req: Request, res: Response): Promise<void> {
        const raceId = validateParams(req.params.id, paramsSchema);
        const data = validateBody({ ...req.body, raceId }, createEthnicGroupSchema);
        const group = await this.raceService.createEthnicGroup(data);

        log.info("Ethnic group created", { groupId: group.id, raceId, operation: "create_ethnic_group" });

        res.status(201).json({ success: true, data: group, message: "Ethnic group created successfully" });
    }

    async getEthnicGroupsByRace(req: Request, res: Response): Promise<void> {
        const raceId = validateParams(req.params.id, paramsSchema);
        const groups = await this.raceService.getEthnicGroupsByRace(raceId);

        res.status(200).json({ success: true, data: groups, message: "Ethnic groups retrieved successfully" });
    }

    async getEthnicGroupById(req: Request, res: Response): Promise<void> {
        const groupId = validateParams(req.params.groupId, paramsSchema);
        const group = await this.raceService.getEthnicGroupById(groupId);

        if (!group) throw new NotFoundError("EthnicGroup", groupId);

        res.status(200).json({ success: true, data: group, message: "Ethnic group retrieved successfully" });
    }

    async updateEthnicGroup(req: Request, res: Response): Promise<void> {
        const groupId = validateParams(req.params.groupId, paramsSchema);
        const data = validateBody(req.body, updateEthnicGroupSchema);
        const group = await this.raceService.updateEthnicGroup(groupId, data);

        log.info("Ethnic group updated", { groupId: group.id, operation: "update_ethnic_group" });

        res.status(200).json({ success: true, data: group, message: "Ethnic group updated successfully" });
    }

    async deleteEthnicGroup(req: Request, res: Response): Promise<void> {
        const groupId = validateParams(req.params.groupId, paramsSchema);
        await this.raceService.deleteEthnicGroup(groupId);

        log.info("Ethnic group deleted", { groupId, operation: "delete_ethnic_group" });

        res.status(200).json({ success: true, message: "Ethnic group deleted successfully" });
    }
}
