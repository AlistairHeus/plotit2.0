import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { RaceRepository } from "@/entities/race/race.repository";
import type {
  CreateEthnicGroup,
  CreateRace,
  EthnicGroup,
  Race,
  RaceQueryParams,
  RaceWithRelations,
  RaceWithRelationsLean,
  UpdateEthnicGroup,
  UpdateRace,
} from "@/entities/race/race.types";
import type { IFileService } from "@/common/file/file.service";

export class RaceService {
  private raceRepository: RaceRepository;
  private fileService: IFileService;

  constructor(raceRepository: RaceRepository, fileService: IFileService) {
    this.raceRepository = raceRepository;
    this.fileService = fileService;
  }

  // --- Race ---

  async createRace(
    data: CreateRace,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Race> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(files.avatar[0], "race");
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "race");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.raceRepository.create(data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getRaces(
    queryParams: RaceQueryParams,
  ): Promise<PaginatedResponse<Race | RaceWithRelationsLean>> {
    const result = await this.raceRepository.findAllWithRelations(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getRaceById(id: string): Promise<RaceWithRelations | null> {
    const result = await this.raceRepository.findOneWithRelations(id);
    if (!result.success) return null;
    return result.data;
  }

  async updateRace(
    id: string,
    data: UpdateRace,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Race> {
    const existing = await this.raceRepository.findOneWithRelations(id);
    if (!existing.success) throw existing.error;
    const oldAvatarUrl = existing.data.avatarUrl;
    const oldImageUrls = existing.data.imageUrls;

    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(files.avatar[0], "race");
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "race");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }

    if (data.avatarUrl !== undefined && data.avatarUrl !== oldAvatarUrl) {
      if (oldAvatarUrl) void this.fileService.moveToTrash(oldAvatarUrl);
    }
    if (data.imageUrls !== undefined) {
      const newImageUrls = data.imageUrls;
      const removedImages = oldImageUrls.filter((url: string) => !newImageUrls.includes(url));
      removedImages.forEach((url: string) => void this.fileService.moveToTrash(url));
    }

    const result = await this.raceRepository.update(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteRace(id: string): Promise<boolean> {
    const existing = await this.raceRepository.findOneWithRelations(id);
    if (existing.success) {
      if (existing.data.avatarUrl) {
        void this.fileService.moveToTrash(existing.data.avatarUrl);
      }
      existing.data.imageUrls.forEach((url: string) => void this.fileService.moveToTrash(url));
    }

    const result = await this.raceRepository.delete(id);
    if (!result.success) throw result.error;
    return result.data;
  }

  // --- Ethnic Groups ---

  async createEthnicGroup(
    data: CreateEthnicGroup,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<EthnicGroup> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "ethnic-group",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "ethnic-group");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
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

  async updateEthnicGroup(
    id: string,
    data: UpdateEthnicGroup,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<EthnicGroup> {
    const existing = await this.raceRepository.findOneEthnicGroup(id);
    if (!existing.success) throw existing.error;
    const oldAvatarUrl = existing.data.avatarUrl;
    const oldImageUrls = existing.data.imageUrls;

    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "ethnic-group",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "ethnic-group");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }

    if (data.avatarUrl !== undefined && data.avatarUrl !== oldAvatarUrl) {
      if (oldAvatarUrl) void this.fileService.moveToTrash(oldAvatarUrl);
    }
    if (data.imageUrls !== undefined) {
      const newImageUrls = data.imageUrls;
      const removedImages = oldImageUrls.filter((url: string) => !newImageUrls.includes(url));
      removedImages.forEach((url: string) => void this.fileService.moveToTrash(url));
    }

    const result = await this.raceRepository.updateEthnicGroup(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteEthnicGroup(id: string): Promise<boolean> {
    const existing = await this.raceRepository.findOneEthnicGroup(id);
    if (existing.success) {
      if (existing.data.avatarUrl) {
        void this.fileService.moveToTrash(existing.data.avatarUrl);
      }
      existing.data.imageUrls.forEach((url: string) => void this.fileService.moveToTrash(url));
    }

    const result = await this.raceRepository.deleteEthnicGroup(id);
    if (!result.success) throw result.error;
    return result.data;
  }
}
