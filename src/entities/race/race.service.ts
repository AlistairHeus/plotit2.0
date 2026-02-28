import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { RaceRepository } from "@/entities/race/race.repository";
import type {
    CreateRace,
    Race,
    RaceQueryParams,
    RaceWithRelations,
    UpdateRace,
} from "@/entities/race/race.types";

export class RaceService {
    private raceRepository: RaceRepository;

    constructor(raceRepository: RaceRepository) {
        this.raceRepository = raceRepository;
    }

    async createRace(data: CreateRace): Promise<Race> {
        const result = await this.raceRepository.create(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getRaces(
        queryParams: RaceQueryParams,
    ): Promise<PaginatedResponse<Race>> {
        const result = await this.raceRepository.findAll(queryParams);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getRaceById(id: string): Promise<RaceWithRelations | null> {
        const result = await this.raceRepository.findOneWithRelations(id);
        if (!result.success) return null;
        return result.data;
    }

    async updateRace(id: string, data: UpdateRace): Promise<Race> {
        const result = await this.raceRepository.update(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async deleteRace(id: string): Promise<boolean> {
        const result = await this.raceRepository.delete(id);
        if (!result.success) throw result.error;
        return result.data;
    }
}
