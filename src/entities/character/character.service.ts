import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { CharacterRepository } from "@/entities/character/character.repository";
import type {
  CreateCharacter,
  Character,
  CharacterQueryParams,
  CharacterWithRelations,
  UpdateCharacter,
  SyncCharacterPowerAccess,
} from "@/entities/character/character.types";
import type { CharacterPowerAccess } from "@/entities/power-system/power-system.types";
import type { IFileService } from "@/common/file/file.service";

export class CharacterService {
  private characterRepository: CharacterRepository;
  private fileService: IFileService;

  constructor(
    characterRepository: CharacterRepository,
    fileService: IFileService,
  ) {
    this.characterRepository = characterRepository;
    this.fileService = fileService;
  }

  async createCharacter(
    data: CreateCharacter,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Character> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "character",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "character");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.characterRepository.create(data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getCharacters(
    queryParams: CharacterQueryParams,
  ): Promise<PaginatedResponse<Character>> {
    const result =
      await this.characterRepository.findAllWithRelations(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getCharacterById(id: string): Promise<CharacterWithRelations | null> {
    const result = await this.characterRepository.findOneWithRelations(id);
    if (!result.success) return null;
    return result.data;
  }

  async updateCharacter(
    id: string,
    data: UpdateCharacter,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Character> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "character",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "character");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.characterRepository.update(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const result = await this.characterRepository.delete(id);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getPowerAccess(characterId: string): Promise<CharacterPowerAccess[]> {
    const result = await this.characterRepository.getPowerAccess(characterId);
    if (!result.success) throw result.error;
    return result.data;
  }

  async syncPowerAccess(
    characterId: string,
    data: SyncCharacterPowerAccess,
  ): Promise<CharacterPowerAccess[]> {
    const result = await this.characterRepository.syncPowerAccess(
      characterId,
      data,
    );
    if (!result.success) throw result.error;
    return result.data;
  }
}
