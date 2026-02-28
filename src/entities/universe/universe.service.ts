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
    const result = await this.universeRepository.create(data);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async getUniverses(
    queryParams: UniverseQueryParams,
  ): Promise<PaginatedResponse<Universe>> {
    const result =
      await this.universeRepository.findAllWithRelations(queryParams);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async getUniverseById(id: string): Promise<Universe | null> {
    const result = await this.universeRepository.findOneWithRelations(id);

    if (!result.success) {
      return null;
    }

    return result.data;
  }

  async updateUniverse(id: string, data: UpdateUniverse): Promise<Universe> {
    const result = await this.universeRepository.update(id, data);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async deleteUniverse(id: string) {
    const result = await this.universeRepository.delete(id);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }
}
