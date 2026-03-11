import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { IFileService } from "@/common/file/file.service";
import type { FactionRepository } from "@/entities/faction/faction.repository";
import type {
  CharacterRelationship,
  CharacterRelationshipWithCharacters,
  CreateFaction,
  CreateRelationship,
  Faction,
  FactionQueryParams,
  FactionWithRelations,
  RelationshipQueryParams,
  UpdateFaction,
  UpdateRelationship,
} from "@/entities/faction/faction.types";

export class FactionService {
  private factionRepository: FactionRepository;
  private fileService: IFileService;

  constructor(factionRepository: FactionRepository, fileService: IFileService) {
    this.factionRepository = factionRepository;
    this.fileService = fileService;
  }

  // ── Factions ────────────────────────────────────────────────────────────────

  async createFaction(data: CreateFaction, files?: Record<string, Express.Multer.File[]>): Promise<Faction> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(files.avatar[0], "faction");
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => this.fileService.getUrl(await this.fileService.save(file, "faction"))),
        );
        data.imageUrls = [...(Array.isArray(data.imageUrls) ? data.imageUrls : []), ...imageUrls];
      }
    }
    const result = await this.factionRepository.create(data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getFactions(queryParams: FactionQueryParams): Promise<PaginatedResponse<Faction>> {
    const result = await this.factionRepository.findAll(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getFactionById(id: string): Promise<FactionWithRelations | null> {
    const result = await this.factionRepository.findOneWithRelations(id);
    if (!result.success) return null;
    return result.data;
  }

  async updateFaction(id: string, data: UpdateFaction, files?: Record<string, Express.Multer.File[]>): Promise<Faction> {
    const existing = await this.factionRepository.findOneWithRelations(id);
    if (!existing.success) throw existing.error;
    const oldAvatarUrl = existing.data.avatarUrl;
    const oldImageUrls = existing.data.imageUrls;

    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(files.avatar[0], "faction");
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => this.fileService.getUrl(await this.fileService.save(file, "faction"))),
        );
        data.imageUrls = [...(Array.isArray(data.imageUrls) ? data.imageUrls : []), ...imageUrls];
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

    const result = await this.factionRepository.update(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteFaction(id: string): Promise<boolean> {
    const existing = await this.factionRepository.findOneWithRelations(id);
    if (existing.success) {
      if (existing.data.avatarUrl) {
        void this.fileService.moveToTrash(existing.data.avatarUrl);
      }
      existing.data.imageUrls.forEach((url: string) => void this.fileService.moveToTrash(url));
    }

    const result = await this.factionRepository.delete(id);
    if (!result.success) throw result.error;
    return result.data;
  }

  // ── Character Relationships ───────────────────────────────────────────────────

  async createRelationship(data: CreateRelationship): Promise<CharacterRelationship> {
    const result = await this.factionRepository.createRelationship(data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async updateRelationship(id: string, data: UpdateRelationship): Promise<CharacterRelationship> {
    const result = await this.factionRepository.updateRelationship(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteRelationship(id: string): Promise<boolean> {
    const result = await this.factionRepository.deleteRelationship(id);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getRelationships(queryParams: RelationshipQueryParams): Promise<CharacterRelationshipWithCharacters[]> {
    const result = await this.factionRepository.findRelationships(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }
}
