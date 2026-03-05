import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { PowerSystemService } from "@/entities/power-system/power-system.service";
import {
    createPowerSystemSchema,
    powerSystemQuerySchema,
    updatePowerSystemSchema,
} from "@/entities/power-system/power-system.validation";
import {
    validateBody,
    validateParams,
    validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";
import type { CreatePowerSystem, PowerSystemQueryParams, UpdatePowerSystem } from "./power-system.types";

export class PowerSystemController {
    private powerSystemService: PowerSystemService;

    constructor(powerSystemService: PowerSystemService) {
        this.powerSystemService = powerSystemService;
    }

    async createPowerSystem(req: Request, res: Response): Promise<void> {
        const powerSystemData = validateBody<CreatePowerSystem>(req.body, createPowerSystemSchema);

        const powerSystem = await this.powerSystemService.createPowerSystem(powerSystemData);

        log.info("PowerSystem created successfully", {
            powerSystemId: powerSystem.id,
            operation: "create_power-system",
        });

        res.status(201).json({
            success: true,
            data: powerSystem,
            message: "PowerSystem created successfully",
        });
    }

    async getPowerSystems(req: Request, res: Response): Promise<void> {
        const powerSystemData = validateQuery<PowerSystemQueryParams>(req.query, powerSystemQuerySchema);

        const result = await this.powerSystemService.getPowerSystems(powerSystemData);

        log.info("PowerSystems retrieved successfully", {
            count: result.data.length,
            totalItems: result.pagination.totalItems,
            currentPage: result.pagination.currentPage,
            operation: "get_power-systems",
        });

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
            message: "PowerSystems retrieved successfully",
        });
    }

    async getPowerSystemsGraph(req: Request, res: Response): Promise<void> {
        const universeId = validateParams<string>(req.params.universeId, paramsSchema);

        const result = await this.powerSystemService.getPowerSystemsGraph(universeId);

        log.info("PowerSystem graph retrieved successfully", {
            universeId,
            operation: "get_power-systems_graph",
        });

        res.status(200).json({
            success: true,
            data: result,
            message: "PowerSystem graph retrieved successfully",
        });
    }

    async getPowerSystemById(req: Request, res: Response): Promise<void> {
        const powerSystemId = validateParams<string>(req.params.id, paramsSchema);

        const powerSystem = await this.powerSystemService.getPowerSystemById(powerSystemId);

        if (!powerSystem) {
            throw new NotFoundError("PowerSystem", powerSystemId);
        }

        res.status(200).json({
            success: true,
            data: powerSystem,
            message: "PowerSystem retrieved successfully",
        });
    }

    async updatePowerSystem(req: Request, res: Response): Promise<void> {
        const powerSystemId = validateParams<string>(req.params.id, paramsSchema);
        const powerSystemData = validateBody<UpdatePowerSystem>(req.body, updatePowerSystemSchema);

        const powerSystem = await this.powerSystemService.updatePowerSystem(powerSystemId, powerSystemData);

        log.info("PowerSystem updated successfully", {
            powerSystemId: powerSystem.id,
            operation: "update_power-system",
        });

        res.status(200).json({
            success: true,
            data: powerSystem,
            message: "PowerSystem updated successfully",
        });
    }

    async deletePowerSystem(req: Request, res: Response): Promise<void> {
        const validationResult = validateParams<string>(req.params.id, paramsSchema);

        await this.powerSystemService.deletePowerSystem(validationResult);

        log.info("PowerSystem deleted successfully", {
            operation: "delete_power-system",
        });

        res.status(200).json({
            success: true,
            message: "PowerSystem deleted successfully",
        });
    }
}
