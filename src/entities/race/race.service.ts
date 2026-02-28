import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { RaceRepository } from "@/entities/race/race.repository";
import type {
    CreateEthnicGroup,
    CreateRace,
    EthnicGroup,
    Race,
    RaceQueryParams,
    RaceWithRelations,
    UpdateEthnicGroup,
    UpdateRace,
} from "@/entities/race/race.types";

export class RaceService {
    private raceRepository: RaceRepository;

    constructor(raceRepository: RaceRepository) {
        this.raceRepository = raceRepository;
    }

    // --- Race ---

    async createRace(data: CreateRace): Promise<Race> {
        const result = await this.raceRepository.create(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getRaces(queryParams: RaceQueryParams): Promise<PaginatedResponse<Race>> {
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

    // --- Ethnic Groups ---

    async createEthnicGroup(data: CreateEthnicGroup): Promise<EthnicGroup> {
        const result = await this.raceRepository.createEthnicGroup(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getEthnicGroupsByRace(raceId: string): Promise<EthnicGroup[]> {
        const result = await this.raceRepository.findEthnicGroupsByRaceId(raceId);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getEthnicGroupById(id: string): Promise<EthnicGroup | null> {
        const result = await this.raceRepository.findOneEthnicGroup(id);
        if (!result.success) return null;
        return result.data;
    }

    async updateEthnicGroup(id: string, data: UpdateEthnicGroup): Promise<EthnicGroup> {
        const result = await this.raceRepository.updateEthnicGroup(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async deleteEthnicGroup(id: string): Promise<boolean> {
        const result = await this.raceRepository.deleteEthnicGroup(id);
        if (!result.success) throw result.error;
        return result.data;
    }
}
