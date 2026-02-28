import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { RegionRepository } from "@/entities/region/region.repository";
import type {
    CreateRegion,
    Region,
    RegionQueryParams,
    UpdateRegion,
} from "@/entities/region/region.types";

export class RegionService {
    private regionRepository: RegionRepository;

    constructor(regionRepository: RegionRepository) {
        this.regionRepository = regionRepository;
    }

    async createRegion(data: CreateRegion): Promise<Region> {
        const result = await this.regionRepository.create(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getRegions(
        queryParams: RegionQueryParams,
    ): Promise<PaginatedResponse<Region>> {
        const result = await this.regionRepository.findAll(queryParams);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getRegionById(id: string): Promise<Region | null> {
        const result = await this.regionRepository.findOneWithRelations(id);
        if (!result.success) return null;
        return result.data;
    }

    async updateRegion(id: string, data: UpdateRegion): Promise<Region> {
        const result = await this.regionRepository.update(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async deleteRegion(id: string): Promise<boolean> {
        const result = await this.regionRepository.delete(id);
        if (!result.success) throw result.error;
        return result.data;
    }
}
