import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { UniverseRepository } from "@/entities/universe/universe.repository";
import type {
  CreateUniverse,
  Universe,
  UniverseQueryParams,
  UpdateUniverse,
} from "@/entities/universe/universe.types";

export class UniverseService {
  private universeRepository: UniverseRepository;

  constructor(universeRepository: UniverseRepository) {
    this.universeRepository = universeRepository;
  }

  async createUniverse(data: CreateUniverse): Promise<Universe> {
    return await this.universeRepository.create(data);
  }

  async getUniverses(
    queryParams: UniverseQueryParams,
  ): Promise<PaginatedResponse<Universe>> {
    return await this.universeRepository.findAllWithRelations(queryParams);
  }

  async getUniverseById(id: string): Promise<Universe | null> {
    try {
      return await this.universeRepository.findOneWithRelations(id);
    } catch {
      return null;
    }
  }

  async updateUniverse(id: string, data: UpdateUniverse): Promise<Universe> {
    return await this.universeRepository.update(id, data);
  }

  async deleteUniverse(id: string): Promise<boolean> {
    return await this.universeRepository.delete(id);
  }
}
