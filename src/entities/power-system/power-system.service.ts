import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { PowerSystemRepository } from "@/entities/power-system/power-system.repository";
import type {
    CreateRootOfPower,
    UpdateRootOfPower,
    RootOfPower,
    CreatePowerSystem,
    UpdatePowerSystem,
    PowerSystem,
    CreatePowerSubSystem,
    UpdatePowerSubSystem,
    PowerSubSystem,
    CreatePowerCategory,
    UpdatePowerCategory,
    PowerCategory,
    CreatePowerAbility,
    UpdatePowerAbility,
    PowerAbility,
    PowerSystemQueryParams,
} from "@/entities/power-system/power-system.types";

export class PowerSystemService {
    private powerSystemRepository: PowerSystemRepository;

    constructor(powerSystemRepository: PowerSystemRepository) {
        this.powerSystemRepository = powerSystemRepository;
    }

    async createPowerSystem(data: CreatePowerSystem): Promise<PowerSystem> {
        const result = await this.powerSystemRepository.createPowerSystem(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getPowerSystems(
        queryParams: PowerSystemQueryParams,
    ): Promise<PaginatedResponse<PowerSystem>> {
        const result = await this.powerSystemRepository.findAllPowerSystems(queryParams);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getPowerSystemsGraph(universeId: string) {
        const result = await this.powerSystemRepository.getGraphData(universeId);
        if (!result.success) throw new Error(String(result.error));
        return result.data;
    }

    async getPowerSystemById(id: string): Promise<PowerSystem | null> {
        const result = await this.powerSystemRepository.findOnePowerSystemWithRelations(id);
        if (!result.success) return null;
        return result.data;
    }

    async updatePowerSystem(id: string, data: UpdatePowerSystem): Promise<PowerSystem> {
        const result = await this.powerSystemRepository.updatePowerSystem(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async deletePowerSystem(id: string): Promise<boolean> {
        const result = await this.powerSystemRepository.deletePowerSystem(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    // --- rootsOfPower ---
    async createRoot(data: CreateRootOfPower): Promise<RootOfPower> {
        const result = await this.powerSystemRepository.createRoot(data);
        if (!result.success) throw result.error;
        return result.data;
    }
    async updateRoot(id: string, data: UpdateRootOfPower): Promise<RootOfPower> {
        const result = await this.powerSystemRepository.updateRoot(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }
    async deleteRoot(id: string): Promise<boolean> {
        const result = await this.powerSystemRepository.deleteRoot(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    // --- powerSubSystems ---
    async createSubSystem(data: CreatePowerSubSystem): Promise<PowerSubSystem> {
        const result = await this.powerSystemRepository.createSubSystem(data);
        if (!result.success) throw result.error;
        return result.data;
    }
    async updateSubSystem(id: string, data: UpdatePowerSubSystem): Promise<PowerSubSystem> {
        const result = await this.powerSystemRepository.updateSubSystem(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }
    async deleteSubSystem(id: string): Promise<boolean> {
        const result = await this.powerSystemRepository.deleteSubSystem(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    // --- powerCategories ---
    async createCategory(data: CreatePowerCategory): Promise<PowerCategory> {
        const result = await this.powerSystemRepository.createCategory(data);
        if (!result.success) throw result.error;
        return result.data;
    }
    async updateCategory(id: string, data: UpdatePowerCategory): Promise<PowerCategory> {
        const result = await this.powerSystemRepository.updateCategory(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }
    async deleteCategory(id: string): Promise<boolean> {
        const result = await this.powerSystemRepository.deleteCategory(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    // --- powerAbilities ---
    async createAbility(data: CreatePowerAbility): Promise<PowerAbility> {
        const result = await this.powerSystemRepository.createAbility(data);
        if (!result.success) throw result.error;
        return result.data;
    }
    async updateAbility(id: string, data: UpdatePowerAbility): Promise<PowerAbility> {
        const result = await this.powerSystemRepository.updateAbility(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }
    async deleteAbility(id: string): Promise<boolean> {
        const result = await this.powerSystemRepository.deleteAbility(id);
        if (!result.success) throw result.error;
        return result.data;
    }
}
