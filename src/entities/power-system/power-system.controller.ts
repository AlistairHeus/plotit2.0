import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { PowerSystemService } from "@/entities/power-system/power-system.service";
import {
    createPowerSystemSchema,
    powerSystemQuerySchema,
    updatePowerSystemSchema,
    createRootOfPowerSchema,
    updateRootOfPowerSchema,
    createPowerSubSystemSchema,
    updatePowerSubSystemSchema,
    createPowerCategorySchema,
    updatePowerCategorySchema,
    createPowerAbilitySchema,
    updatePowerAbilitySchema,
} from "@/entities/power-system/power-system.validation";
import {
    validateBody,
    validateParams,
    validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";
import type {
    CreatePowerSubSystem,
    UpdatePowerSubSystem,
    CreatePowerCategory,
    UpdatePowerCategory,
    CreatePowerAbility,
    UpdatePowerAbility,
} from "./power-system.types";

export class PowerSystemController {
    private powerSystemService: PowerSystemService;

    constructor(powerSystemService: PowerSystemService) {
        this.powerSystemService = powerSystemService;
    }

    async createPowerSystem(req: Request, res: Response): Promise<void> {
        const powerSystemData = validateBody(req.body, createPowerSystemSchema);

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
        const powerSystemData = validateQuery(req.query, powerSystemQuerySchema);

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
        const powerSystemData = validateBody(req.body, updatePowerSystemSchema);

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
        const id = validateParams<string>(req.params.id, paramsSchema);
        await this.powerSystemService.deletePowerSystem(id);
        log.info("PowerSystem deleted successfully", { id, operation: "delete_power-system" });
        res.status(200).json({ success: true, message: "PowerSystem deleted successfully" });
    }

    // --- rootsOfPower ---
    async createRoot(req: Request, res: Response): Promise<void> {
        const data = validateBody(req.body, createRootOfPowerSchema);
        const result = await this.powerSystemService.createRoot(data);
        res.status(201).json({ success: true, data: result, message: "Root created successfully" });
    }
    async updateRoot(req: Request, res: Response): Promise<void> {
        const id = validateParams<string>(req.params.id, paramsSchema);
        const data = validateBody(req.body, updateRootOfPowerSchema);
        const result = await this.powerSystemService.updateRoot(id, data);
        res.status(200).json({ success: true, data: result, message: "Root updated successfully" });
    }
    async deleteRoot(req: Request, res: Response): Promise<void> {
        const id = validateParams<string>(req.params.id, paramsSchema);
        await this.powerSystemService.deleteRoot(id);
        res.status(200).json({ success: true, message: "Root deleted successfully" });
    }

    // --- powerSubSystems ---
    async createSubSystem(req: Request, res: Response): Promise<void> {
        const data = validateBody<CreatePowerSubSystem>(req.body, createPowerSubSystemSchema);
        const result = await this.powerSystemService.createSubSystem(data);
        res.status(201).json({ success: true, data: result, message: "SubSystem created successfully" });
    }
    async updateSubSystem(req: Request, res: Response): Promise<void> {
        const id = validateParams<string>(req.params.id, paramsSchema);
        const data = validateBody<UpdatePowerSubSystem>(req.body, updatePowerSubSystemSchema);
        const result = await this.powerSystemService.updateSubSystem(id, data);
        res.status(200).json({ success: true, data: result, message: "SubSystem updated successfully" });
    }
    async deleteSubSystem(req: Request, res: Response): Promise<void> {
        const id = validateParams<string>(req.params.id, paramsSchema);
        await this.powerSystemService.deleteSubSystem(id);
        res.status(200).json({ success: true, message: "SubSystem deleted successfully" });
    }

    // --- powerCategories ---
    async createCategory(req: Request, res: Response): Promise<void> {
        const data = validateBody<CreatePowerCategory>(req.body, createPowerCategorySchema);
        const result = await this.powerSystemService.createCategory(data);
        res.status(201).json({ success: true, data: result, message: "Category created successfully" });
    }
    async updateCategory(req: Request, res: Response): Promise<void> {
        const id = validateParams<string>(req.params.id, paramsSchema);
        const data = validateBody<UpdatePowerCategory>(req.body, updatePowerCategorySchema);
        const result = await this.powerSystemService.updateCategory(id, data);
        res.status(200).json({ success: true, data: result, message: "Category updated successfully" });
    }
    async deleteCategory(req: Request, res: Response): Promise<void> {
        const id = validateParams<string>(req.params.id, paramsSchema);
        await this.powerSystemService.deleteCategory(id);
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    }

    // --- powerAbilities ---
    async createAbility(req: Request, res: Response): Promise<void> {
        const data = validateBody<CreatePowerAbility>(req.body, createPowerAbilitySchema);
        const result = await this.powerSystemService.createAbility(data);
        res.status(201).json({ success: true, data: result, message: "Ability created successfully" });
    }
    async updateAbility(req: Request, res: Response): Promise<void> {
        const id = validateParams<string>(req.params.id, paramsSchema);
        const data = validateBody<UpdatePowerAbility>(req.body, updatePowerAbilitySchema);
        const result = await this.powerSystemService.updateAbility(id, data);
        res.status(200).json({ success: true, data: result, message: "Ability updated successfully" });
    }
    async deleteAbility(req: Request, res: Response): Promise<void> {
        const id = validateParams<string>(req.params.id, paramsSchema);
        await this.powerSystemService.deleteAbility(id);
        res.status(200).json({ success: true, message: "Ability deleted successfully" });
    }
}
