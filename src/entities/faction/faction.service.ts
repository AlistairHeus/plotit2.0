import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { FactionRepository } from "@/entities/faction/faction.repository";
import type {
  CreateFaction,
  Faction,
  FactionQueryParams,
  UpdateFaction,
} from "@/entities/faction/faction.types";
import type { IFileService } from "@/common/file/file.service";

export class FactionService {
  private factionRepository: FactionRepository;
  private fileService: IFileService;

  constructor(factionRepository: FactionRepository, fileService: IFileService) {
    this.factionRepository = factionRepository;
    this.fileService = fileService;
  }

  async createFaction(
    data: CreateFaction,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Faction> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "faction",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "faction");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.factionRepository.create(data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getFactions(
    queryParams: FactionQueryParams,
  ): Promise<PaginatedResponse<Faction>> {
    const result = await this.factionRepository.findAll(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getFactionById(id: string): Promise<Faction | null> {
    const result = await this.factionRepository.findOneWithRelations(id);
    if (!result.success) return null;
    return result.data;
  }

  async updateFaction(
    id: string,
    data: UpdateFaction,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Faction> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "faction",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "faction");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.factionRepository.update(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteFaction(id: string): Promise<boolean> {
    const result = await this.factionRepository.delete(id);
    if (!result.success) throw result.error;
    return result.data;
  }
}
