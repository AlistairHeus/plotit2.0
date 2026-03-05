import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { PowerSystemRepository } from "@/entities/power-system/power-system.repository";
import type {
    CreatePowerSystem,
    PowerSystem,
    PowerSystemQueryParams,
    UpdatePowerSystem,
} from "@/entities/power-system/power-system.types";

export class PowerSystemService {
    private powerSystemRepository: PowerSystemRepository;

    constructor(powerSystemRepository: PowerSystemRepository) {
        this.powerSystemRepository = powerSystemRepository;
    }

    async createPowerSystem(data: CreatePowerSystem): Promise<PowerSystem> {
        const result = await this.powerSystemRepository.create(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getPowerSystems(
        queryParams: PowerSystemQueryParams,
    ): Promise<PaginatedResponse<PowerSystem>> {
        const result = await this.powerSystemRepository.findAll(queryParams);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getPowerSystemsGraph(universeId: string) {
        const result = await this.powerSystemRepository.getGraphData(universeId);
        if (!result.success) throw new Error(String(result.error));
        return result.data;
    }

    async getPowerSystemById(id: string): Promise<PowerSystem | null> {
        const result = await this.powerSystemRepository.findOneWithRelations(id);
        if (!result.success) return null;
        return result.data;
    }

    async updatePowerSystem(id: string, data: UpdatePowerSystem): Promise<PowerSystem> {
        const result = await this.powerSystemRepository.update(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async deletePowerSystem(id: string): Promise<boolean> {
        const result = await this.powerSystemRepository.delete(id);
        if (!result.success) throw result.error;
        return result.data;
    }
}
